var express = require('express');
var DButilsAzure = require('../DButils');
var Sudoku = express.Router();
var parser = require('body-parser');
const jwt = require('jsonwebtoken');

Sudoku.use(express.json());
module.exports = Sudoku;

var cors = require('cors');
Sudoku.use(cors());
Sudoku.get('/getBoard/:PuzzleID', function (req, res) {
    var PuzzleID = req.params.PuzzleID;
    var type = req.params.type;
    DButilsAzure.execQuery("SELECT * FROM sodukoInstance where PuzzleID='"+PuzzleID+"'")
    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            res.send(result)


        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})


Sudoku.post('/createNewGame', function (req, res) {

    console.log("why 2 times 22222222 ");
    var userID = req.body.userID;
    var puzzleID = req.body.puzzleID;
    var type = req.body.type;
    var insertQuery = "insert into SudokuToUser (PuzzleID, UserID, GameType) values ('"+puzzleID+"','"+userID+"','"+type+"')";
    DButilsAzure.execQuery(insertQuery)
    // (intrestName, userName, date, reviewDescription, rank) values ('"+interestName+"','"+username+"','"+fullDate+"','"+description+"','"+rank+"')";

    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            res.send(result)


        })
        .catch(function (err) {
            console.log("here errorrrrr")
            res.send(err)
        })

    // var getQuery = "select GameID from SudokuToUser "
    // DButilsAzure.execQuery(queryCountryCheck)
})


Sudoku.get('/getGameID', function (req, res) {

    // var query = "select * from SudokuToUser";
    var query = "SELECT MAX(GameID) FROM SudokuToUser";
    DButilsAzure.execQuery(query)
    // (intrestName, userName, date, reviewDescription, rank) values ('"+interestName+"','"+username+"','"+fullDate+"','"+description+"','"+rank+"')";

    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            res.send(result)


        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })




})

Sudoku.post('/move', function (req, res) {

    var GameID = req.body.GameID;
    console.log(GameID);
    var stepValueAndCords = req.body.stepValueAndCords;//rowcolval
    var query = "select *  from runningSudoku where gameID='"+GameID+"'";
    var stepID;
    var stepType;
    if(stepValueAndCords.length >2){
        stepType = "insert";
    }else{
        stepType = "delete";
    }

    var time = req.body.time;//TODO CLIENT SEND 4 DIGITS OF TIME LEFT/ TIME PASSED?
    DButilsAzure.execQuery(query)
    // (intrestName, userName, date, reviewDescription, rank) values ('"+interestName+"','"+username+"','"+fullDate+"','"+description+"','"+rank+"')";

    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (getResult) {
            console.log("successssssssssssssssssssssssssssssssssssss");
            // stepID = getResult.rowsAffected();
            console.log(stepID);
            stepID = getResult.length+1;
            console.log(stepID);
            var postQuery = "insert into runningSudoku values ('"+GameID+"','"+ stepID+"','"+ stepType+"','"+time+"','"+stepValueAndCords +"')";

            console.log("starting second query");
            console.log(postQuery);
            DButilsAzure.execQuery(postQuery)
                .then(function (postQueryResult) {
                    res.send(postQueryResult)
                })
                .catch(function (postQueryResult) {
                    console.log(postQueryResult)
                    res.send(postQueryResult)
                })
        })
        .catch(function (getResultErrr) {
            console.log(getResultErrr)
            res.send(getResultErrr)
        })



    // (intrestName, userName, date, reviewDescription, rank) values ('"+interestName+"','"+username+"','"+fullDate+"','"+description+"','"+rank+"')";

    // var query = "select orderPOI from userData where userName='"+username+"'";


})

Sudoku.post('/submitQuestinary', function (req, res) {

    var workerID = req.body.workerID;
    var age = req.body.age;
    var gender = req.body.gender;
    var hand = req.body.hand;
    var education = req.body.education;
    var compilation = "0";
    var postQuery = "insert into users values ('"+workerID+"','"+ age+"','"+ gender+"','"+hand+"','"+education+"','"+compilation+"')";
    DButilsAzure.execQuery(postQuery)
    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            res.send(result)

        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})

Sudoku.get('/getUserID', function (req, res) {

    var query = "select max (userID) as maxid from users";
    DButilsAzure.execQuery(query)
    // (intrestName, userName, date, reviewDescription, rank) values ('"+interestName+"','"+username+"','"+fullDate+"','"+description+"','"+rank+"')";

    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            console.log(result)
            console.log(result)
            res.send(result)


        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })

})

Sudoku.post('/submitFinishQuestion', function (req, res) {

    var difficulty = req.body.difficulty;
    var correctness = req.body.correctness;
    var gameID = req.body.gameID;
    var userID = req.body.userID;

    console.log("gameID====== "+gameID);
    console.log("userID====== "+userID);

    var postQuery = "update SudokuToUser set  CorrectnessEstimate= '"+correctness+"', DifficultyEstimate= '"+difficulty+"' where UserID= '"+userID+"' and GameID= '"+gameID+"'";

    DButilsAzure.execQuery(postQuery)
    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            res.send(result)

        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})

// Sudoku.post('/amountOfCorrectedCells', function (req, res) {
//
//     var
//
//
// }
Sudoku.post('/finishGame', function (req, res) {
    var originalBoard =req.body.originalBoard;
    var totalTime = req.body.totalTime;
    var gameID = req.body.gameID;
    var solutionBoardOfUser = req.body.solutionBoard + "";
    var filledCells = allFilledCells(originalBoard,solutionBoardOfUser);
    console.log("filled cells are: "+filledCells);
    var numberOfCellsFilled = filledCells.length;
    console.log(numberOfCellsFilled);
    // var numberOfCellsFilledCorrectly = numberOfCellsFilledCorrectly(solutionBoardOfUser,filledCells);

    var postQuery = "update SudokuToUser set Solution =' " +solutionBoardOfUser + "' , totalTime='" + totalTime + "' where GameID = "+gameID;

    DButilsAzure.execQuery(postQuery)
    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            let results = [];
            results.push(result);
            results.push(numberOfCellsFilled);
            res.send(results)

        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })

})

Sudoku.post('/updateCompletionCode', function (req, res) {

    var code = req.body.compCode;
    var userID = req.body.userID;

    var postQuery = "update users set  completionCode= '"+code+"' where UserID= '"+userID+"'";

    DButilsAzure.execQuery(postQuery)
    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            res.send(result)

        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})

Sudoku.post('/submitFamiliarityAndDifficultyEstimateBefore', function (req, res) {

    var difBefore = req.body.difBefore;
    var familiarity = req.body.familiarity;
    var gameID = req.body.gameID;
    var userID = req.body.userID;

    console.log("gameID====== "+gameID);
    console.log("userID====== "+userID);

    var postQuery = "update SudokuToUser set  DifficultyEstBefore= '"+difBefore+"', familiarityAnswer= '"+familiarity+"'  where UserID= '"+userID+"' and GameID= '"+gameID+"'";

    DButilsAzure.execQuery(postQuery)

    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            res.send(result)

        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})

Sudoku.get('/getSudokuNumQuestion', function (req, res) {



    var query = "select * from sudokuNumbersQuestions";
    DButilsAzure.execQuery(query)
    // (intrestName, userName, date, reviewDescription, rank) values ('"+interestName+"','"+username+"','"+fullDate+"','"+description+"','"+rank+"')";

    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            console.log(result)
            console.log(result)
            res.send(result)


        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })

})

Sudoku.get('/getKnapsackQuestions', function (req, res) {



    var query = "select * from KSquestions";
    DButilsAzure.execQuery(query)
    // (intrestName, userName, date, reviewDescription, rank) values ('"+interestName+"','"+username+"','"+fullDate+"','"+description+"','"+rank+"')";

    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            console.log(result)
            console.log(result)
            res.send(result)


        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })

})

function allFilledCells (original, solution){
    var originalBoard = original.split(',');
    var solutionBoardFromUser = solution.split(',');
    let filledCells = [];
    for(let i = 0; i < solutionBoardFromUser.length;i++){
        if(originalBoard[i]==0 && solutionBoardFromUser[i] != 0)
            filledCells.push(i);
    }
    return (filledCells);

}

Sudoku.post('/updateRecommendations', function (req, res) {
    var userID = ""+ req.body.userID;
    var exam = ""+ req.body.exam;
    var tutorial =""+ req.body.tutorial;
    var games = ""+req.body.games;
    var other = ""+req.body.other;
    var sql = "insert into Recommendations values ('"+userID+"','"+exam+"','"+tutorial+"','"+games+"','"+other+"')";
    console.log(sql);
    DButilsAzure.execQuery(sql)
        .then(function (result) {
            res.send(result)

        })
        .catch(function (err) {
            console.log("failed");
            res.send(err)
        })
})