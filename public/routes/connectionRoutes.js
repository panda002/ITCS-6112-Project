let express = require('express')
let bodyParser = require('body-parser')
let router = express.Router();
let ConnectionDB = require('../utils/connectionDB');
const connectionDB = new ConnectionDB();
//https://www.mongodb.com/blog/post/generating-globally-unique-identifiers-for-use-with-mongodb
let uuid4 = require('uuid4');
let userProfDB = require('../utils/UserProfileDB');
const userProfileDB = new userProfDB();
let UserProfile = require('../models/UserProfile');
const userProfile = new UserProfile();
let Connection = require('../models/connection');
const connObj = new Connection();
const {check, body, validationResult, matchedData} = require('express-validator');
let urlencodedParser = bodyParser.urlencoded({extended: false})

/**
 * route for displaying connection details after submitting a new form
 * */
router.get('/', function(req, res){
        connectionDB.getConnection(connObj.getEventID(), function (connection) {
        res.render('connection' ,{connection: connection, user: req.session.theUser});
    });
});

/**
 * route for getting all the connection from the ConnectionDB
 * */
router.get('/all', async function (req, res) {
    let topic = await connectionDB.getEvents();
    let data1 = await connectionDB.getConnections()
    let data = {
        "topic": topic,
        "connections":data1,
    };
    if(req.session.theUser)
    {
        res.render('connections', {data: data, user: req.session.theUser});
    }else{
        res.render('connections', {data: data, user: req.session.theUser});
    }

});

/**
 * Route to get the newConnection view
 * */
router.get('/newConnection',urlencodedParser, function (req, res) {
    //Checks if session exists else renders the index page
    if (req.session.theUser)
    {
        const error = validationResult(req)
        res.render('newConnection' ,{user: req.session.theUser, error:error, formData:[]});
    }else{
        res.render('index',{user: req.session.theUser, error:[]});
    };
});

/**
 * Routing for posting the form and display the data in the Connection page
 * Validation added for individual form values
 * */
router.post('/newConnection',urlencodedParser,
    [
        body('topic', 'Topic cannot be blank').not().isEmpty(),
        body('topic', 'Topic - AlphaNumeric Only').matches(/^(\w+ ?)*$/i),
        body('name', 'Name cannot be blank').not().isEmpty(),
        body('name', 'Name - AlphaNumeric Only').matches(/^(\w+ ?)*$/i),
        body('details', 'Details cannot be blank').not().isEmpty(),
        check('details', 'Details should be more than 6 chars').isLength({ min: 6 }),
        body('where', 'Where cannot be blank').not().isEmpty(),
        body('when', 'When cannot be blank').not().isEmpty(),
        check('when').custom((value, { req }) =>{
            // reference - https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            if (req.body.when <= today)
            {
                throw new Error("When should be ahead of today's date");
            }
            return true;
        }),
        body('start_time', 'Start_time cannot be blank').not().isEmpty(),
        check('start_time').custom((value, {req}) =>
        {
            var st = req.body.start_time.split(':').join('')
            var et = req.body.end_time.split(':').join('')
            if(Date.parse(et) <= Date.parse(st))
            {
                throw new Error('Start Time should be before End Time');
            }
            return true;
        }),
        body('end_time', 'End_time cannot be blank').not().isEmpty()
    ],
    function (req, res) {
    //Checks if session exists else renders the index page
    if (req.session.theUser)
    {
        const error = validationResult(req)
        if(error.isEmpty() === true) {
            console.log("validation passed!!!!")
            userProfile.setUserID(req.session.theUser);
            userProfile.setEventID(uuid4());
            userProfile.setRsvp('Yes')
            // adds user and event details to the user profile to the DB
            userProfileDB.addUserProfile(userProfile, function () {
            });
            // adds connection details from the form to the DB
            connObj.setUserID(req.session.theUser)
            connObj.setEventID(userProfile.getEventID())
            connObj.setTopic(req.body.topic)
            connObj.setName(req.body.name)
            connObj.setDetails(req.body.details)
            connObj.setWhere(req.body.where)
            connObj.setWhen(req.body.when)
            connObj.setStart_Time(req.body.start_time)
            connObj.setEnd_Time(req.body.end_time)
            connectionDB.addConnection(connObj, function () {
                res.redirect('/connection')
            });
        }
    else {
            const formData = matchedData(req);
            res.render('newConnection', {error: error.mapped(), formData:formData, user: req.session.theUser})
        }
    }else{
        res.render('index',{user: req.session.theUser});
    };
});

/**
 * route for getting a particular connection from the ConnectionDB
 * */
router.get('/:eventID', async function (req, res) {
    let eventID = req.params.eventID;
              connectionDB.getConnection(eventID, function (connection) {
                  if (req.session.theUser) {
                      
                      //For invalid connection id, we will display error page

                      if (typeof connection === 'undefined' || connection.length === 0) {
                          res.render('error', {user: req.session.theUser});
                      }
                      res.render('connection', {connection: connection, user: req.session.theUser});
                  } else {
                      res.render('connection', {connection: connection, user: req.session.theUser});
                  }
              });
});

module.exports = router