let Connection = require('../models/connection')
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Connections", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('Successfully connected to MongoDB');
});

//Schema for connectionDetails collection

var connectionSchema = new mongoose.Schema({
    eventID : {type:String, required: true},
    userID : {type:String, required: true},
    topic: {type:String, required: true},
    name: {type:String, required: true},
    details: {type:String, required: true},
    where: {type:String, required: true},
    when: {type:String, required: true},
    start_time: {type:String, required: true},
    end_time: {type:String, required: true}
});

var connectionDetailsDB = mongoose.model('connectionDetails', connectionSchema);

class ConnectionDB {

    /**
     * return the connection from the connectionDetails collection
     * */
    getConnections() {
        return new Promise((resolve, reject) => {
            connectionDetailsDB
                .find({})
                .then((conndata) => {
                    let conn = [];
                    conndata.forEach(connection => {
                        conn.push(new Connection(connection.eventID,connection.userID, connection.topic, connection.name,
                            connection.details, connection.where, connection.when, connection.start_time, connection.end_time));
                    });
                    resolve(conn);
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }

    /**
     * return the eventID of a single connection from the connectionDetails collection
     * */
    getConnection(eventID, callback){
        if (eventID !== 'undefined'){
            connectionDetailsDB
                .find({ eventID: eventID })
                .exec()
                .then((conndata) => {
                    let conn = new Array();
                    conndata.forEach(connection => {
                        let connObj = new Connection();
                        connObj.setEventID(connection.eventID)
                        connObj.setUserID(connection.userID)
                        connObj.setTopic(connection.topic)
                        connObj.setName(connection.name)
                        connObj.setDetails(connection.details)
                        connObj.setWhere(connection.where)
                        connObj.setWhen(connection.when)
                        connObj.setWhen(connection.when)
                        connObj.setWhen(connection.when)
                        connObj.setStart_Time(connection.start_time)
                        connObj.setEnd_Time(connection.end_time)
                        conn.push(connObj);
                    });
                    //resolve with array of data object
                    callback(conn);
                })
        } else {
            return undefined;
        }
    }


    /**
     * return the topic of all connection from the connectionDetails collection
     * */
    getEvents(){
        return new Promise((resolve, reject) => {
            connectionDetailsDB
                .find({})
                .then((conndata) => {
                    let events = [];
                    conndata.forEach(connection => {
                        if(!events.includes(connection.topic)){
                            events.push(connection.topic);
                        }
                    });
                    //resolve with array of data object
                    resolve(events);
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }

    /**
     * Adds a new connection to the connectionDetails collection
     * */
    addConnection(connection, callback){
        let newConn = new connectionDetailsDB(connection)
        newConn.save()
            .then(function (newConnection) {
                //console.log("added new Connection",connection)
                callback(newConnection)
            })
    }
}

module.exports = ConnectionDB