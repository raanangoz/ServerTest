var express = require('express');
var DButilsAzure = require('../DButils');
var Knapsack = express.Router();
var parser = require('body-parser');
const jwt = require('jsonwebtoken');

Knapsack.use(express.json());
module.exports = Knapsack;

var cors = require('cors');
Knapsack.use(cors());

/**
 * get instance of a problem by difficulty
 */
Knapsack.get('/getBoard/:dif', function (req, res) {
    console.log(req);
    var dif = req.params.dif;
    //var dif = Math.floor(Math.random() * 4) + 2;
    //console.log("diffffffffffffff:"+dif)
    var type = req.params.type;
    DButilsAzure.execQuery("SELECT * FROM KSInstance where difficult='"+dif+"'")
    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            res.send(result)


        })
        .catch(function (err) {
            console.log(err)
            console.log("getBoard")
            res.send(err)
        })
})

Knapsack.post('/createNewGame', function (req, res) {
    var userID = req.body.userID;
    var puzzleID = req.body.puzzleID;
    var type = req.body.type;
    var insertQuery = "insert into KSToUser (PuzzleID, UserID, GameType) values ('"+puzzleID+"','"+userID+"','"+type+"')";
    DButilsAzure.execQuery(insertQuery)
        .then(function (result) {

            res.send(result)

        })
        .catch(function (err) {
            console.log("here errorrrrr")
            console.log("createNewGame")
            res.send(err)
        })

})

Knapsack.get('/getGameID', function (req, res) {

    // var query = "select * from SudokuToUser";
        var query = "SELECT MAX(GameID) FROM KSToUser";
    DButilsAzure.execQuery(query)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log("getGameID")
            console.log(err)
            res.send(err)
        })
})

Knapsack.post('/insertMove', function (req, res) {//TODO MAYBE DELETEMOVE ASWELL

    var GameID = req.body.GameID;
    console.log(GameID);
    //TODO item ID?
    var itemID= 1;
    var itemWeight = req.body.itemWeight;
    var itemValue = req.body.itemValue;
    var query = "select *  from runningKS where gameID='"+GameID+"'";
    var stepID;
    var steptype = req.body.type;
    var userID = req.body.userID;
    var time = req.body.time;//TODO CLIENT SEND 4 DIGITS OF TIME LEFT/ TIME PASSED?
    DButilsAzure.execQuery(query)
        .then(function (getResult) {
            console.log("successssssssssssssssssssssssssssssssssssss");
            stepID = getResult.rowsAffected;
            // console.log(stepID);
            stepID = getResult.length+1;
            console.log(stepID);
            var postQuery = "insert into runningKS values ('"+GameID+"','"+ stepID+"','"+ steptype+"','"+time+"','"+itemID+"','"+itemWeight +"','"+itemValue +"')";
            console.log("starting second query");
            console.log(postQuery);
            DButilsAzure.execQuery(postQuery)
                .then(function (postQueryResult) {
                    res.send(postQueryResult)
                })
                .catch(function (postQueryResult) {
                    console.log(postQueryResult)
                    res.send(postQueryResult)
                    console.log("insertMove1")
                })
        })
        .catch(function (getResultErrr) {
            console.log(getResultErrr)
            console.log("insertMove2")
            res.send(getResultErrr)
        })
})

Knapsack.get('/getUserID', function (req, res) {//TODO DUPLICATED CODE

    var query = "select max (userID) as maxid from users";
    DButilsAzure.execQuery(query)
    // (intrestName, userName, date, reviewDescription, rank) values ('"+interestName+"','"+username+"','"+fullDate+"','"+description+"','"+rank+"')";

    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            console.log(result)
            console.log("getUserID")
            res.send(result)


        })
        .catch(function (err) {
            console.log(err)
            console.log("finish")
            res.send(err)
        })

})


Knapsack.post('/finishGame', function (req, res) {//TODO MAYBE DELETEMOVE ASWELL

    console.log("finishing game");
    console.log(req.body);

    var GameIDU = req.body.GameID;
    console.log(GameIDU);
    //TODO item ID?
    var totalTimeU = req.body.totalTime;
    var SolutionU = req.body.Solution;
    var PuzzleIDU = req.body.PuzzleID;
    var solWU = req.body.solutionWeight;
    var solVU = req.body.solutionValue;
    console.log(solWU);
    console.log(solVU);
    //var query = "select *  from runningKS where gameID='"+GameID+"'";
    var query = "update KSToUser set  Solution= '"+SolutionU+"', totalTime= '"+totalTimeU+"', solutionWeight= '"+solWU+"', solutionValue= '"+solVU+"' where GameID= '"+GameIDU+"' and PuzzleID= '"+PuzzleIDU+"'";
    //"update SudokuToUser set  CorrectnessEstimate= '"+correctness+"', DifficultyEstimate= '"+difficulty+"' where UserID= '"+userID+"' and GameID= '"+gameID+"'";
    //var time = req.body.time;//TODO CLIENT SEND 4 DIGITS OF TIME LEFT/ TIME PASSED?
    console.log(query);
    DButilsAzure.execQuery(query)
        .then(function (getResult) {
            console.log("successssssssssssssssssssssssssssssssssssss");
            // stepID = getResult.rowsAffected;
            // console.log(stepID);

        })
        .catch(function (getResultErrr) {
            console.log(getResultErrr)
            console.log("finish")
            res.send(getResultErrr)
        })
})

Knapsack.post('/getPres',function (req, res) {
    var userID = req.body.userID;
    console.log(userID+"~!~~~~!~!~!")
     DButilsAzure.execQuery("SELECT * FROM KSToUser where UserID='"+userID+"'")
    // // var query = "select orderPOI from userData where userName='"+username+"'";
         .then(function (result) {
             console.log(result)
             res.send(result)


         })
         .catch(function (err) {
             console.log(err)
             console.log("getBoard")
             res.send(err)
         })
})

Knapsack.get('/getPresentationCounter/:presentation', function (req, res) {

    var presentation = "p" +req.params.presentation;
    console.log("presentation= "+presentation);
    query = "SELECT "+presentation+" FROM KSPresentation";
    //DButilsAzure.execQuery("SELECT presentation FROM KSPresentation")
    DButilsAzure.execQuery(query)
    // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            res.send(result)


        })
        .catch(function (err) {
            console.log(err)
            console.log("getBoard")
            res.send(err)
        })
})

Knapsack.post('/updateCounterPresentation',function (req, res) {
    var presentation = "p" +req.body.presentation.toString();
    var currentValue = req.body.counterPresentation - 1;
    var query = "update KSPresentation set  "+presentation+"= '"+currentValue+"'";

    DButilsAzure.execQuery(query)

    // // var query = "select orderPOI from userData where userName='"+username+"'";
        .then(function (result) {
            console.log(result)
            res.send(result)


        })
        .catch(function (err) {
            console.log(err)
            console.log("getBoard")
            res.send(err)
        })
})

Knapsack.post('/submitFamiliarityAndDifficultyEstimateBefore', function (req, res) {

    var difBefore = req.body.difBefore;
    var familiarity = req.body.familiarity;
    var gameID = req.body.gameID;
    var userID = req.body.userID;

    console.log("gameID====== "+gameID);
    console.log("userID====== "+userID);

    var postQuery = "update KSToUser set  DifficultyEstBefore= '"+difBefore+"', familiarityAnswer= '"+familiarity+"'  where UserID= '"+userID+"' and GameID= '"+gameID+"'";

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
Knapsack.post('/submitFinishQuestion', function (req, res) {

    var userID = req.body.userID;
    var gameID = req.body.gameID;
    var confident = req.body.confident;
    var difficulty = req.body.difficultyRank;
    var estimatePeopleDif = req.body.estimatePeopleDif;
    var heaviestItem = req.body.heaviestItem;
    var op1= req.body.op1;
    var op2= req.body.op2;
    var op3= req.body.op3;
    var op4= req.body.op4;
    var postQuery = "update KSToUser set difficultForOthers= '"+estimatePeopleDif+"', heaviestItem= '"+heaviestItem+"', confidentInAnswer= '"+confident+"', difficultForMe= '"+difficulty+"',op1='"+op1+"',op2='"+op2+"',op3='"+op3+"',op4='"+op4+"' where UserID= '"+userID+"' and GameID= '"+gameID+"'";
    // where gameID='"+GameID+"'";

    console.log(postQuery);
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