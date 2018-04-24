const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb server ', err);
    }
    console.log('Connected to mongodb server')
    const db = client.db('TodoApp')

    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert ', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
    })
    /*
    db.collection('Users').insertOne({
        name: 'Marcin',
        age: 17,
        location: 'Kraków'
    },(err,result) => {
        if(err) {
            return console.log(err)
        }
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
    })
*/
    client.close();
});