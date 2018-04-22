const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb server ', err);
    }
    console.log('Connected to mongodb server')
    const db = client.db('TodoApp')

    db.collection('Todos').find().toArray().then((docs) => {
        console.log('Todos')
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log('Enable to fetch todos')
    })

    //client.close();
});