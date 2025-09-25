const express = require('express');
const router = express.Router();

router.get('/',(req, res)=>{
    res.send('hello everyone welcome to project');
})

router.get('/login', (req, res)=>{
    res.render('login',{title:"hello"})
})

module.exports = router