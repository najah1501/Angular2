//server.js file is to communicate with external interface

var connection = require ("./connection.js");
//console.log(connection.connectionString);

var express = require("express");
var app = express();

var promise = require("promise");
var mongoose = require ("mongoose");

mongoose.connect(connection.connectionString,{
   keepAlive :true, //tells the mongoose or mongodb that even there is no connection being connect,
                    // just execute.no need to disconnect
   reconnectTries:Number.MAX_VALUE, //
   useMongoClient :true // default value given by mongoose.It tells that need to use mongoose
                        //in order to connect with mongo database.
});

var UserModel = require ("./model/UserModel.js");
var FruitModel = require ("./model/FruitModel.js");
//kitInfo is to map between model and kitInfos (internal information),
//it just nothing but is only for a reference

//schema is in syntax json
// model define what syntax need to written to the collection.
var Kit = mongoose.model('kitInfo',UserModel,'kitInfos');
var Fruit = mongoose.model('fruitInfo',FruitModel,'fruitInfos');




/*console.log(Kit);*/
var bodyParser = require ('body-parser');
app.use (bodyParser.json());

var port = 3000;

app.get('/check' ,function (req,res) {
    myTest = {
        "id": "0001",
        "type": "donut",
        "name": "Cake",
        "ppu": 0.55,
        "batters":
            {
                "batter":
                    [
                        { "id": "1001", "type": "Regular" },
                        { "id": "1002", "type": "Chocolate" },
                        { "id": "1003", "type": "Blueberry" },
                        { "id": "1004", "type": "Devil's Food" }
                    ]
            },
        "topping":
            [
                { "id": "5001", "type": "None" },
                { "id": "5002", "type": "Glazed" },
                { "id": "5005", "type": "Sugar" },
                { "id": "5007", "type": "Powdered Sugar" },
                { "id": "5006", "type": "Chocolate with Sprinkles" },
                { "id": "5003", "type": "Chocolate" },
                { "id": "5004", "type": "Maple" }
            ]
    };
    var allDetails = myTest.topping;

    for(var i=0; i<allDetails.length; i++)
    {
        console.log(allDetails[i]);
    }

    var str = "123,124,234,252";
    var newValue = str.split(",");
    res.send({status:"Success", result:"fair",x:newValue[0],topping:allDetails[2]});
    //console.log(allDetails[2]);

});

app.post('/samplePost', function (req,res) {

    var result = req.body.input.split(",");
    console.log(result);
    res.send({"Index":result[req.body.index]});
});

app.post('/sampleReplace',function (req,res) {
    var allDetails = req.body.message;
    console.log(allDetails);

    var n = allDetails.length;
    console.log(n);

    res.send({"message": allDetails.replace(/a/g, req.body.replace).replace(/m/g, "k") ,"length":n});
});

app.post('/postInfo',function (req,res) {

//dataInfo is instantiate from Kit model.
var resultJSON = {"result1":"You're kid","result2":"You're teenager","result3":"You're young","result4":"You're already old"};
var age =req.body.age;


if(isNaN(req.body.age )||(req.body.age<=0))
{
    res.send({"status":"Invalid Type Of Age"});
    return 0;
}

switch (true)
{
    case (age >= 1 && age <= 10) :
        resultJSON = resultJSON.result1;
        break;

    case (age >= 11 && age <= 20) :
        resultJSON = resultJSON.result2;
        break;

    case (age > 20 && age < 50) :
        resultJSON = resultJSON.result3;
        break;

    default :
        resultJSON = resultJSON.result4;
        break;
}


var details = {
    name : req.body.name,
    age : req.body.age,
    address : req.body.address,
    result : resultJSON
};

var dataInfo = new Kit(details);
dataInfo.save (function (err) {
});

res.send({"status":"Successfully Saved Data"});
});

app.post('/postFruit',function (req,res) {
    console.log(req.body);
    var fruitDetails = new Fruit(req.body);
    fruitDetails.save (function (err) {
    });
});


/*app.post('/updateInfo',function (req,res) {

    Kit
        .update({_id: req.body._id},
            {
                $set:
                    {
                        name: req.body.name,
                        address: req.body.address
                    }
            },function (err,docs) {

                try {

                    if (err)
                    {
                        throw err;
                    }

                    if (docs) {
                        res.send(docs);
                    }
                }

                catch (err)
                {
                    res.send({"Error":err})
                }
             }//end of function err,docs

             )//end of update

});*/



app.post('/updateInfo',function (req,res) {

    try {
        Kit
            .update({_id: req.body._id},
                {
                    $set:
                        {
                            name: req.body.name,
                            address: req.body.address
                        }
                },function (err,docs) {
                    if(err){
                        throw err;
                    }

                    if(docs){
                        res.send(docs);
                    }
                })
    }

    catch(err){
        console.log("CatchError",err);
        res.send({"CatchError":err});
    }

});


app.post('/deleteInfo',function (req,res) {
   Kit
       .remove({_id:req.body._id},function (err,docs) {
           if(err){
               res.send(err);
           }
           else{
               res.send(docs);
           }
       })
});

app.get('/viewInfo',function (req,res) {

    Kit.find({ age: { $gte:req.query.fromAge,$lte:req.query.toAge  } }).exec(function (err,docs) {
        res.json(docs);
        console.log(req.query);
    });

});





//print result using if else statement.
/*app.post('/postDatas',function (req,res) {

//dataInfo is instantiate from Kit model.

var result;

 if(req.body.age >= 50)
 {
     result = "You're already old";
 }

 else if (req.body.age > 20 && req.body.age <50)
 {
     result = "You're young";
 }

 else
 {
     result = "You're kid"
 }

var details = {
    name : req.body.name,
    age : req.body.age,
    address : req.body.address,
    result : result
};

 var dataInfo = new Kit(details);
 dataInfo.save (function (err) {
 res.send("success");
 })

});*/

//print result using case statement.
/*app.post('/postDatas',function (req,res) {

//dataInfo is instantiate from Kit model.

    var result;
    var age =req.body.age;
    switch (true)
    {
        case (age >=1 && age<=10) :
        result = "You're kid";
        break;

        case (age >=11 && age<=20) :
        result = "You're teenager";
        break;

        case (age > 20 && age <50) :
        result = "You're young";
        break;

        case (age >= 50) :
        result = "You're already old";
        break;

        default :
        result = "Age is not valid"
    }


    var details = {
        name : req.body.name,
        age : req.body.age,
        address : req.body.address,
        result : result
    };

    var dataInfo = new Kit(details);
    dataInfo.save (function (err) {
    res.send("success");
    })

});*/

/*app.post('/postDatas',function (req,res) {

    var resultJSON = {"result1":"You're kid","result2":"You're teenager","result3":"You're young","result4":"You're already old"};
    var age =req.body.age;
    var alertResult;

    if(isNaN(req.body.age )||(req.body.age<=0)) {
        alertResult = "Invalid type of age"; //save value to alertResult
    }

    else{
        switch (true) {
            case (age >= 1 && age <= 10) :
                resultJSON = resultJSON.result1;
                break;

            case (age >= 11 && age <= 20) :
                resultJSON = resultJSON.result2;
                break;

            case (age > 20 && age < 50) :
                resultJSON = resultJSON.result3;
                break;

            default :
                resultJSON = resultJSON.result4;
                break;

        }
    }

    var details = {
        name : req.body.name,
        age : req.body.age,
        address : req.body.address,
        result : resultJSON
    };

    var KitInfo = new Kit(details);
    KitInfo.save (function (err){});
    res.send({"Info":"Success",alertResult});

});*/


//lebih besar atau sama dgn 15 and lebih kcik atau sma dgn 50
//http://localhost:3000/userInfo?$gte=15&$lte=50

//lebih besar dr 35 and lebih kcik dr 75
//http://localhost:3000/userInfo?$gt=35&$lt=75

//$gte ¶. Syntax: {field: {$gte: value} }. $gte selects the documents where the value of the field is greater than or equal to (i.e. >= )
//$gt ¶. Syntax: {field: {$gt: value} }. $gt selects those documents where the value of the field is greater than

//Kit.find().sort( { "name": -1} ).exec(function (err,docs) {
//db.orders.find().sort( { "item.category": 1, "item.type": 1 } )

//JSON.stringify() will take any javascript object and convert it into a json string
/*var jsonArray1 = {'name': "doug", 'id':5};
var test = JSON.stringify(jsonArray1);
console.log(jsonArray1);
console.log(test);*/











    //new schema
/*var GeneralSchema = new mongoose.Schema({

    firstName : String ,
    lastName : String ,
    emailAddress :String ,
    phoneNum : String

});*/

/*mongoose.model('GeneralSchema',GeneralSchema);
var General = mongoose.model('GeneralSchema');*/

//check is route
// function is the callback
//req res are the paramaters


/*app.post("/postUserDetail",function (req,res) {
    console.log(req.body);
    General
        .create({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            emailAddress : req.body.emailAddress,
            phoneNum : req.body.phoneNum

        } , function (err,dataFromDb) {
            if(err){
                res.send("failed")
            }

            if(dataFromDb){
                res.send("success");
            }
        })
});*/

/*app.post("/deleteUserDetail" ,function (req,res) {
    console.log(req.body.firstName);
    General
        .remove({firstName : req.body.firstName} , function (err, dataFromDB) {
            if(dataFromDB)
            {
                res.send("deleteSuccess");
            }

            if(err)
            {
                res.send("deleteFailed");
            }
        })

});*/

/*app.post("/updateUserDetail",function (req,res) {
    General
        .update(
            { _id: req.body._id },
            {
                $set: {
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    emailAddress : req.body.emailAddress
                }
            },

            function (err,dataFromDb) {
                if(err){
                    res.send("failed");
                }

                if(dataFromDb){
                    res.send("success");
                }
            });

    console.log(req.body)
});*/



app.listen(port ,function () {
    console.log(" app listening to port " + port)
});
