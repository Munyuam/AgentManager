const express = require('express')
const route = require('./routes/routes')
const layout = require('express-ejs-layouts')
const dotenv = require('dotenv')
const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('Public'));
app.set('layout', 'main/layout');
app.use(layout);

app.set('view engine', 'ejs');


app.use('/', route);

app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT)
})