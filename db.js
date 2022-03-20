// 实现  插入 查询 更新 数据（mySQL 数据库）
//   https://www.npmjs.com/package/mysql   数据库 连接
const express = require('express');
const { buildSchema } = require('graphql');
const mysql = require('mysql');
//const grapqlHTTP = require('express-graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;

// 连接 数据库
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tafeshop'
});
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});


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
         deleteAccount(id: ID!):  Boolean
     }
     type Query{
         accounts:[Account]
         accountOne(id: ID!):[Account]
     }
    `)
    //模拟 数据库
const fakeDb = {};
//root  定义 查询 对应的处理器
const root = {
    accounts() {
        // 因为是 异步 操作，所以 使用 promise【正常应该return data，但是 使用promise时，return promise】 再resolve data
        return new Promise((resolve, reject) => {
                connection.query('select name,age,sex,department from account', (err, results) => {
                        if (err) {
                            console.log('出错了' + err.message);
                            return;
                        }
                        const arr = [];
                        for (let i = 0; i < results.length; i++) {
                            arr.push({
                                name: results[i].name,
                                sex: results[i].sex,
                                age: results[i].age,
                                department: results[i].department,
                            });
                        }
                        resolve(arr);
                    }

                );
            }

        );
    },
    accountOne({ id }) { //where name= ?', [data, id]
        // 因为是 异步 操作，所以 使用 promise【正常应该return data，但是 使用promise时，return promise】 再resolve data
        return new Promise((resolve, reject) => {
                connection.query('select name,age,sex,department from account where name= ?', [id], (err, results) => {
                        if (err) {
                            console.log('出错了' + err.message);
                            return;
                        }
                        const arr = [];
                        for (let i = 0; i < results.length; i++) {
                            arr.push({
                                name: results[i].name,
                                sex: results[i].sex,
                                age: results[i].age,
                                department: results[i].department,
                            });
                        }
                        resolve(arr);
                    }

                );
            }

        );
    },
    createAccount({ input }) {
        const data = {
            name: input.name,
            age: input.age,
            sex: input.sex,
            department: input.department
        };
        // 因为是 异步 操作，所以 使用 promise【正常应该return data，但是 使用promise时，return promise】 再resolve data
        return new Promise((resolve, reject) => {
                connection.query('insert into account set ?', data, (err) => {
                        if (err) {
                            console.log('出错了' + err.message);
                            return;
                        }
                        resolve(data);
                    }

                );
            }

        );



        // 相当于 数据库的保存
        fakeDb[input.name] = input;
        //返回 保存 结果
        return fakeDb[input.name];
    },
    updateAccount({ id, input }) {
        const data = input;
        // 因为是 异步 操作，所以 使用 promise【正常应该return data，但是 使用promise时，return promise】 再resolve data
        // name后边 的 = 不能忘
        return new Promise((resolve, reject) => {
                connection.query('update  account set ? where name= ?', [data, id], (err) => {
                        if (err) {
                            console.log('出错了' + err.message);
                            return;
                        }
                        resolve(data);
                    }

                );
            }

        );
    },
    deleteAccount({ id }) {

        // 因为是 异步 操作，所以 使用 promise【正常应该return data，但是 使用promise时，return promise】 再resolve data
        // delete from account: from 不能忘
        return new Promise((resolve, reject) => {
                connection.query('delete from account where name= ?', [id], (err) => {
                        if (err) {
                            console.log('出错了' + err.message);
                            reject(false);
                            return;
                        }
                        resolve(true);
                    }

                );
            }

        );
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