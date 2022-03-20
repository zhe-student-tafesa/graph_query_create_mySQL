const express = require('express');
const { buildSchema } = require('graphql');
//const grapqlHTTP = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
//定义 a Schema   //  `不能忘。   查询和类型  //自定义 类型 不能 有逗号
const schema = buildSchema(`
    type AccountInfo{
        name: String
        age: Int
        sex: String
        department: String
    }

    type Query {
        hello: String
        account: String
        accountInfo: AccountInfo
    }
    `)
    //root  定义 查询 对应的处理器
const root = {
    hello: () => {
        return 'Hello World';
    },
    account: () => {
        return '张三丰';
    },
    accountInfo: () => {
        return {
            name: '临时工',
            age: '18',
            sex: '男',
            department: '科学院0026'
        };
    }
}

const app = express();
// /graphql地址： 交给 graphqlHTTP处理    // 是graphiql，不要 丢了i
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(3000);