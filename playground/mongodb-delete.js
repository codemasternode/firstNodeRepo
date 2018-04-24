const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb server ', err);
    }
    console.log('Connected to mongodb server')
    const db = client.db('TodoApp')

    db.collection('Todos').deleteMany({ text: 'Something to do' }).then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log('Enable to delete todos')
    })

    //client.close();
});