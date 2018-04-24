var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var todoSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})


var Todo = mongoose.model('Todo', todoSchema);

module.exports = {
    Todo
}