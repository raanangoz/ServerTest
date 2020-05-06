var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');
var Sudoku = require('./Modules/Sudoku');
var Knapsack = require('./Modules/Knapsack');
// var favorites = require('./Modules/Favorites');

app.use('/Sudoku', Sudoku);
app.use('/Knapsack', Knapsack);
// app.use('/Favorites', favorites);
var cors = require('cors');
app.use(cors());

var port = 3000;
app.use(express.json());
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});



app.get('/select', function (req, res) {
    DButilsAzure.execQuery('SELECT firstName FROM users')
        .then(function (result) {
            res.send(result)

        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})












































