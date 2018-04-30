const _ = require('lodash') //Lodash jest niskopoziomową biblioteką JavaScript służącą do obróbki danych, jej algorytmy są bardzo zoptymalizowane
const express = require('express') //Express to biblioteka służąca do postawienia serwera z routingiem itp.
const bodyParser = require('body-parser') //'rozpakowuje' dane pochodzące z żądania, używamy go jako middleware

const { ObjectID } = require('mongodb') //import klasy odpowiedzialnej za prawidłowe operacje na polach typu ID
var { mongoose } = require('./db/mongoose') //Tutaj realizowane jest połączenie z bazą danych
var { Todo } = require('./models/todo') //To jest model Todo
var { User } = require('./models/user') //To jest model User
var { authenticate } = require('../middleweare/authentication') 

var app = express()
const port = process.env.PORT || 3000;
app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    //Tworzenie nowego obiektu i przypisywanie mu wartości pochodzących z żądania
    var todo = new Todo({
        text: req.body.text
    })                  

    todo.save().then((doc) => {
        console.log(doc)
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})


app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos/:id', (req, res) => {
    var id = req.params.id

    //sprawdzamy czy id które zostało podane w żądaniu jest odpowiednie
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'Id is not valid'
        })
    }

    //Wbudowana metoda szukająca po id
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({ error: 'Todo with this id doesn t exist' })
        }
        res.send(todo);
    }).catch((e) => {
        return res.send('Error' + e).status(500)
    })

})

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.send({ error: "Not valid id" })
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                error: 'No valid id'
            })
        }
        res.send(todo)
    }).catch((e) => {
        res.status(400).send({
            error: 'internal error'
        })
    })

})

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['text', 'completed'])
    console.log('To jest body', JSON.stringify(body, undefined, 4))
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'Id is not valid'
        })
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findOneAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }

        res.send({ todo })
    }).catch((e) => {
        res.status(400).send()
    })

})


app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])
    const user = new User(body)

    // User.findByToken
    // user.generateAuthToken


    user.save().then(() => {
        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(user)
    }).catch((e) => {
        res.status(400).send(e);
    })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})


app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth',token).send()
        })
    }).catch((e) => {
        res.status(400).send()
    })


})



app.listen(port, () => {
    console.log(`Started on port ${port}`)
})
