const express = require('express')
const route = require('./routes/routes')
const layout = require('express-ejs-layouts')
const session = require('express-session');
const dotenv = require('dotenv')
const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: 'grpAssignment',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 24 * 100 * 100 * 1000 
  }
}));


app.use(express.static('Public'));
app.set('layout', 'main/layout');
app.use(layout);

app.set('view engine', 'ejs');


app.use('/', route);

app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT)
})