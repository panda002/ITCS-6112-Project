var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Connections", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true});

//Schema for userDetails collection
var userSchema = new mongoose.Schema({
    nickname : {type:String, required: true},
    first_name: {type:String, required: true},
    last_name: {type:String, required: true},
    emailID: {type:String, required: true},
    password: {type:String, required: true}
});

var userDetailsDB = mongoose.model('userDetails', userSchema);

class UserDB {


    /**
     * Gets back user details
     * Currently we are checking if email id and password match wth the one in the database
     * @param emailID
     * @param callback
     */
    getUsers(emailID, password, callback) {
        userDetailsDB.find({emailID: emailID, password: password}, function (err, docs) {
            if(docs.length == 0)
            {
                const err = "UserID or password incorrect"
                callback(err);
            }
            else{
                callback(err, docs[0].emailID);
            }
        });

    }
}

module.exports = UserDB;