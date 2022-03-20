// 实现   中间件 拦截  根据请求header决定继续往下走，还是 返回错误 消息
const express = require('express');
const { buildSchema } = require('graphql');
//const grapqlHTTP = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
//定义 a Schema   //  `不能忘。   查询和类型 和 mutation                  //自定义 类型 不能 有逗号
const schema = buildSchema(`
    input AccountInput{
        name: String
        age: Int
        sex: String
        department: String
    }
    type Account {
        name: String
        age: Int
        sex: String
        department: String
    }
     type Mutation {
         createAccount(input: AccountInput):  Account
         updateAccount(id: ID!, input: AccountInput):  Account
     }
     type Query{
         accounts:[Account]
     }
    `)
    //模拟 数据库
const fakeDb = {};
//root  定义 查询 对应的处理器
const root = {
    accounts() {
        // 把对象 转成 数组
        var arr = [];
        for (const key in fakeDb) {
            arr.push(fakeDb[key]);
        }
        return arr;
    },
    createAccount({ input }) {
        // 相当于 数据库的保存
        fakeDb[input.name] = input;
        //返回 保存 结果
        return fakeDb[input.name];
    },
    updateAccount({ id, input }) {
        // 相当于 数据库的更新 //做拷贝，，把参数 2,3 的合并到 参数1上
        const updatedAccount = Object.assign({}, fakeDb[id], input);
        //   数据库的保存
        fakeDb[id] = updatedAccount;
        //返回 保存 结果
        return updatedAccount;
    }


}

const app = express();

//中间件本质是：function
const middleware = (req, res, next) => {
    console.log(123);
    //如果 url是 /graphql  且 header 里没有 auth时，返回错误信息，否则正常进行下一步   Cannot read property 'indexOf' of undefined
    if (req.url.indexOf('/graphql') !== -1 && req.headers.cookie.indexOf('auth') === -1) {
        // JSON.stringify 把对象 转成 字符串
        res.send(
            JSON.stringify({
                error: "您没有权限访问这个接口"
            })
        );
        return;
    }
    next(); //继续 往下 走

};
// 把 中间件 注册 进来
app.use(middleware);

// /graphql地址： 交给 graphqlHTTP处理    // 是graphiql，不要 丢了i
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(3000);