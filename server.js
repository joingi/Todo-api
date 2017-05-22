var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'Sækja um skóla',
    completed: false
},{
    id: 2,
    description: 'Finna einkanir',
    completed: false
},{
    id: 3,
    description: 'byrja á Node.js',
    completed: true
}];

app.get('/', function (req, res) {
    res.send('Todo api Root');
});


// GET /todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

// Get /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;

    // Iterate todos array and find match
    todos.forEach(function(todo) {
        if (todoId === todo.id) {
            matchedTodo = todo;
        }
    });

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

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});