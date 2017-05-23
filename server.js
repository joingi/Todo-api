var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo api Root');
});


// GET /todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

// Get /todos/:id
app.get('/todos/:id', function (req, res) {
    // parseInt converts id from string to number
    var todoId = parseInt(req.params.id, 10);
    // using underscore.js
    var matchedTodo = _.findWhere(todos, {id: todoId});

    // var matchedTodo;

    // Iterate todos array and find match
    // todos.forEach(function(todo) {
    //     if (todoId === todo.id) {
    //         matchedTodo = todo;
    //     }
    // });

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// ++++ OPTION USING find method ++++
// app.get('/todos/:id', function (req, res) {
//     var todoId = parseInt(req.params.id, 10);
//     var matchedTodo = todos.find(function (todo) {
//       return todo.id === todoId;
//     });

//     if (matchedTodo) {
//       res.json(matchedTodo);
//     } else {
//       res.status(404).send();
//     }
// });

// Post /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.description = body.description.trim();

    body.id = todoNextId;
    todoNextId++;
    // or body.id = todoNextId++;

    // push body into array
    todos.push(body);

    res.json(body);
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});