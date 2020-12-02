/**
 * User - represents a user of the application with the following properties:
 * */
class User {
    constructor(userID, first_name, last_name, emailID) {
        this._userID = userID;
        this._first_name = first_name;
        this._last_name = last_name;
        this._emailID = emailID;
    }


    getUserID() {
        return this._userID;
    }

    getFirst_name() {
        return this._first_name;
    }

    getLast_name() {
        return this._last_name;
    }

    getEmailID() {
        return this._emailID;
    }


    setUserID(value) {
        this._userID = value;
    }

    setFirst_name(value) {
        this._first_name = value;
    }

    setLast_name(value) {
        this._last_name = value;
    }

    setEmailID(value) {
        this._emailID = value;
    }
}

module.exports = User;