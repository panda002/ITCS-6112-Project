/** UserProfile - represents the user profile.
 * Contains the list of user connections as well as functions to support getting, adding and removing connections from the user profile.
 * In other words, it's a class/module with methods/functions to store and manage the user connections in the user profile.
 *
 * properties:
 User ID or User to associate this UserProfile object to the user
 a list containing UserConnection objects for this user
 */

var mongoose = require("mongoose");
let ConnectionDB = require('../utils/connectionDB');
const connectionDB = new ConnectionDB()
let UserProfile = require('../models/UserProfile');
const userProfiles = new UserProfile();

// Schema for userProfile collection
let userProfileSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    eventID: {type: String, required: true},
    rsvp: {type: String, required: true},
});

var userProfile = mongoose.model('userProfile', userProfileSchema);

class userProfileDB {

    constructor(user_ID, connection_list) {
        this.user_ID = user_ID;
        this.connection_list = connection_list;
    };
    /**
     * updateRSVP- updates an RSVP property for a specified UserConnection
     * */
    updateRSVP(eventID, rsvp, user, callback) {
        let classContext = this;
        userProfile.findOneAndUpdate(
            {eventID: eventID, userID: user },
            {$set: {rsvp: rsvp}},
            {new: true})
            .then(function (connection) {
                if(connection != null){
                    console.log("updateRSVP",connection)
                    callback(connection)
                }
                else{
                    userProfiles.setEventID(eventID)
                    userProfiles.setUserID(user)
                    userProfiles.setRsvp(rsvp)
                    console.log("userProfile model is - ", userProfiles)
                    classContext.addUserProfile(userProfiles, callback)
                }
            });
    };

    /**addConnection – adds a UserConnection for this connection / rsvp to the user profile.
     * The profile should not allow multiple UserConnections for the same connection,
     * but should update appropriately if one already exists
     * */
    addUserProfile(userConnections, callback) {
        let newConn = new userProfile(userConnections)
        newConn.save()
            .then(function (newConnection) {
                console.log("added user profile Connection")
                callback(newConnection)
            })
    };

    /**
     * getUserConnections – returns a List / Collection of UserConnection from the user profile
     * */
    getUserConnections(userID, callback) {

        this.getUserProfile(userID, function (userProfile) {
            let eventID = []
            let rsvp = {}
            userProfile.forEach(function (connection) {
                eventID.push(connection.eventID);
                rsvp[connection.eventID] = connection.rsvp;
            });
            connectionDB.getConnection(eventID, function (events) {
                let userConnections = []
                events.forEach(function (event) {
                    event.rsvp = rsvp[event.eventID];
                    userConnections.push(event);
                });
                callback(userConnections);
            });
        });
    };

    /**
     * getUserProfile – returns a List / Collection of User Profile from the DB
     * */
    getUserProfile(userID, callback){
        userProfile.find({userID: userID})
            .exec()
            .then(function (userConnections) {
                callback(userConnections)
            })
    }

    /**
     * deleteUserProfile – Deletes User Profile from the DB
     * */
    deleteUserProfile(userID, eventID, callback){
        userProfile.deleteOne({ userID: userID , eventID: eventID})
            .exec()
            .then(function (removed) {
                callback(removed)
            })
    }
}

module.exports = userProfileDB