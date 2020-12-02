/**
 * Connection - represents a Connection available to the user of the application with the following properties:
 * */
class Connection {
    constructor(eventID, userID, topic, name, details, where, when, start_time, end_time) {
        this.eventID = eventID;
        this.userID = userID;
        this.topic = topic;
        this.name = name;
        this.details = details;
        this.where = where;
        this.when = when;
        this.start_time = start_time;
        this.end_time = end_time;
    }


    getUserID() {
        return this.userID;
    }

    setUserID(value) {
        this.userID = value;
    }

    getEventID() {
        return this.eventID;
    }

    setEventID(eventID) {
        this.eventID = eventID;
    }

    getTopic() {
        return this.topic;
    }

    setTopic(topic) {
        this.topic = topic;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    geDetails() {
        return this.details;
    }

    setDetails(details) {
        this.details = details;
    }

    getWhere() {
        return this.where;
    }

    setWhere(where) {
        this.where = where;
    }

    getWhen() {
        return this.when;
    }

    setWhen(when) {
        this.when = when;
    }

    getStart_Time() {
        return this.start_time;
    }

    setStart_Time(start_time) {
        this.start_time = start_time;
    }
    getEnd_Time() {
        return this.end_time;
    }

    setEnd_Time(end_time) {
        this.end_time = end_time;
    }

}


module.exports = Connection;