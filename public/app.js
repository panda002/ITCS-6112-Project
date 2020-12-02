let express = require('express')
let app = express()
var session = require('express-session');

app.set('view engine', 'ejs')
app.set("views", __dirname + '/views')
app.use('/assets', express.static('assets'))
app.use('/views', express.static('views'))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(session({secret: 'mysecretpwd', resave: false, saveUninitialized: false}));


var connectionRoutes = require('./routes/connectionRoutes.js')
let index = require('./routes/index.js');
let user = require('./routes/UserController')

app.use('/connection', connectionRoutes);
app.use('/user', user)
app. use('/', index)

app.listen(8084,function(){
    console.log('app started')
    console.log('listening on port 8084')
});