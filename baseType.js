const express = require('express');
const { buildSchema } = require('graphql');
//const grapqlHTTP = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
//定义 a Schema   //  `不能忘。   查询和类型  //自定义 类型 不能 有逗号
const schema = buildSchema(`
  
type Account{
    name: String
    age: Int
    sex: String
    department: String
    salary(city:String): Int
}
    type Query {
        getClassMates(classNo: Int!): [String] 
        account(userName: String):Account
    }
    `)
    //root  定义 查询 对应的处理器  使用{}，把{classNo} 解构出来
const root = {
    getClassMates({ classNo }) {
        //模拟 数据库 读出的数据  3年级1班，  6年级1班
        const obj = {
            31: ['Ali', '张三', '李四'],
            61: ['Baba', '王五', '赵六']
        };
        return obj[classNo];
    },
    account({ userName }) {
        const name = userName;
        const age = 18;
        const sex = 'man';
        const department = 'TE';
        const salary = ({ city }) => {
            if (city === '北京' || city === '上海' || city === '广州' || city === '深圳') {
                return 10000;
            } else {
                return 4000;
            }
        };
        return {
            name,
            age,
            sex,
            department,
            salary
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
    //gaos告诉 express向外 公开 一个 文件夹，来供 外部 用户 来 访问 静态 资源
app.use(express.static('public'));
app.listen(3000);