class UserProfile {
    constructor(userID, eventID, rsvp) {
        this.userID = userID;
        this.eventID = eventID;
        this.rsvp = rsvp;
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

    setEventID(value) {
        this.eventID = value;
    }

    getRsvp() {
        return this.rsvp;
    }

    setRsvp(value) {
        this.rsvp = value;
    }
}

module.exports = UserProfile;