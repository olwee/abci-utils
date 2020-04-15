"use strict";

var yargs = require('yargs');

var TodoApp = require('./todo');

var todoApp = TodoApp({
  cache: {
    appData: {
      todoList: []
    }
  }
});
yargs.command('add-todo [todo]', 'Create a new Todo', function (args) {
  args.positional('todo', {
    describe: 'Name of the todo'
  });
}, function (argv) {
  var todo = argv.todo;
  todoApp.broadcastTx('add', todo).then(function () {//
  })["catch"](function (err) {
    if (err) console.log(err);
  });
}).command('list', 'List all Todo(s)', function (args) {
  args.options('height', {
    demandOption: false
  }).options('data', {
    alias: 'd',
    demandOption: false
  }).options('path', {
    alias: 'p',
    demandOption: false
  });
}, function (argv) {
  var path = argv.path,
      height = argv.height,
      data = argv.data;
  todoApp.queryCLI({
    path: path,
    height: height,
    data: data
  }).then(function () {//
  })["catch"](function (err) {
    if (err) console.log(err);
  });
}).help('h').argv;
//# sourceMappingURL=cli.js.map
