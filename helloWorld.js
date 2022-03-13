const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

//定义 a Schema   //  `不能忘。   查询和类型
const schema = buildSchema(` 
    type Query {
        hello: String
    }
    `);

//root  定义 查询 对应的处理器
const root = {
    hello: () => {
        return 'Hello World';
    }
};


const app = express();
// /graphql地址： 交给 graphqlHTTP处理
app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }
    // 是graphiql，不要 丢了i
));
app.listen(3000);