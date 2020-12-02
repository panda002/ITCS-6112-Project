/** UserConnection – represents a connection object saved to the user profile
( associates a connection to a user profile) with the following properties:
Connection
rsvp
Any other fields you find necessary (optional)
 */

function UserConnection(connections, rsvp) {
    this.connection = connections;
    this.rsvp = rsvp;
}

module.exports.UserConnection = UserConnection;