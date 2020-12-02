/**
 * This controller is responsible for answering requests that pertain to user-specific functionality.
 * These are the requests for accessing a service the application provides to support its users.
 * These are registered users (we are simulating that with are hardcoded data)
 * and these services/functionalities are specific and available to them.
 * An application-user should be able to navigate to a view that lists connections
 * they saved in the application as well as navigate to a view to provide connection RSVP.
 * */

var express = require('express');
let bodyParser = require('body-parser');
let router = express.Router();
let UserDB = require('../utils/UserDB')
const userdb = new UserDB();
let userProfDB = require('../utils/UserProfileDB');
const userProfileDB = new userProfDB();
const {check, body, validationResult, matchedData} = require('express-validator'); //Applying Security Measures

let urlencodedParser = bodyParser.urlencoded({extended: false});

/**
 * Filename: login.ejs – this page is accessible from the User Controller and
 linked into the application flow from the“Log In/Sign In” links in the user navigation bar.
 It should provide submission of username (email) and password for a user to login to the application and view their profile of saved connections.
 The “Log In/Sign In” button should be linked to the UserController.
 */
router.get('/login', function (req, res) {
    if (req.session.theUser) {
        res.redirect('savedConnections');
    } else {
        res.render('login', {error: [], user: []});
    }
});

router.post('/login', urlencodedParser,
    [
        // username must be an email
        body('username', 'Username should not be empty').not().isEmpty(),
        body('username', 'Username should be email').isEmail(),
        // password must not be empty
        // for this application we have not implemented any other validations since we dont have to create new password
        body('password', 'Password should not be empty').not().isEmpty()
    ],
    async function (req, res) {
        const validation_result = validationResult(req);
        if (validation_result.isEmpty() === true) {
            //User has filled in all the form fields correctly
            /**
             * Create a User object, by hard-coding a user properties.
             * This is currently a placeholder for user login and authentication.
             * For now the user will not have to go through all the steps of entering their details or logging in to their account.
             * (Note: when user login is implemented this would respond by displaying the login view to ask the user to login to proceed)
             * */
            //console.log("After validation")
            await userdb.getUsers(req.body.username, req.body.password, function (err, newUser) {
                if (err) {
                    res.render('login', {error: err, user: []});
                } else {
                    console.log("post login newUser - ", newUser)
                    req.session.theUser = newUser;
                    /**
                     * Display a user's list of saved connections - list all user connections on the savedConnections view
                     * */
                    res.redirect('savedConnections');
                }
            });
        } else {
            let sendError = '';
            var user = matchedData(req)
            validation_result.array().forEach((error) => {
                sendError += error.msg + ',\n';
            });
            res.render('login', {error: sendError, user: user})
        }
    });

/**
 * Logout a user (remove a user from the session)
 * */
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

/**
 * Display a user's list of saved connections - list all user connections on the savedConnections view
 * */
router.get('/savedConnections', urlencodedParser, function (req, res) {
    //Checks if session exists else renders the index page
    if (req.session.theUser) {
        /**
         * This controller should continue to store a user's current profile contents in the session as long as the session is not destroyed
         *
         * @type {userProfileDB}
         */
        userProfileDB.getUserConnections(req.session.theUser, function (userConnections) {
            /**
             * Add the list of saved connections to the session object as “currentProfile”.
             Dispatch to the profile view
             */
            req.session.currentProfile = userConnections;
            res.render('savedConnections', {
                user: req.session.theUser,
                userConnections: req.session.currentProfile,
            });
        });
    } else {
        res.render('index', {user: req.session.theUser});
    };
});

//Routing for RSVP options
router.post('/rsvp', urlencodedParser, function (req, res) {
    //Checks if session exists else renders the index page
    let params = req.body;

    if (req.session.theUser) {
        /**
         * If the action is "rsvp"
         Check the http request for parameter called "rsvp"
         If this parameter exists and its value does not match either "yes", "no", or "maybe" (this indicates something is wrong)
         Dispatch to the profile* view displaying no updates to the profile
         */
        if (params.rsvp == 'Yes' || params.rsvp == 'No' || params.rsvp == 'Maybe') {
            /**
             * Update a user's rsvp for a connection -
             * update the value for the RSVP for a specific user connection already in the profile
             * */
            userProfileDB.updateRSVP(params.eventID, params.rsvp, req.session.theUser, function () {
                res.redirect('savedConnections');
            })
        } else {
            /**
             * Delete a user's rsvp for a connection - delete a specific user connection already in the profile
             * */
            if (params.Delete == 'Delete') {
                userProfileDB.deleteUserProfile(req.session.theUser, params.eventID, function () {
                    res.redirect('savedConnections');
                });
            };
        }
    } else {
        res.render('login', {error: [], user: []});
    };
});
module.exports = router;