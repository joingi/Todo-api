var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

// GET /todos?completed=true&q=house // Search function
app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({where: where}).then(function (todos) {
        res.json(todos);
    },function (e) {
        res.status(500).send();
    });

    // var filteredTodos = todos;

    // if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    //     filteredTodos = _.where(filteredTodos, {
    //         completed: true
    //     });
    // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    //     filteredTodos = _.where(filteredTodos, {
    //         completed: false
    //     });
    // }

    // if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    //     filteredTodos = _.filter(filteredTodos, function (todo) {
    //         return todo.description.toLowerCase().indexOf(queryParams.q) > -1;
    //     });
    // }

    // res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function (todo) {
        if (!!todo) {
            res.status(200).send();
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();
    });

});

// POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(404).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({where: {
        id: todoId
    }}).then(function (rowDeleted) {
        if (rowDeleted === 0) {
            res.status(404).json({
                error: 'no todo with id '
            });
        } else {
            res.status(204).send();
        }
    }, function (e) {
        res.status(500).send();
    });

    // var matchedTodo = _.findWhere(todos, {
    //     id: todoId
    // });

    // if (!matchedTodo) {
    //     res.status(404).json({
    //         "error": "no todo found with that id"
    //     });
    // } else {
    //     todos = _.without(todos, matchedTodo);
    //     res.json(matchedTodo);
    // }
});


// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});
});


db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});