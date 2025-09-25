const express = require('express');
const router = express.Router();
const logindetails = require('../services/loginddetails');



router.get('/', (req, res)=>{
    res.render('main',{
        title : 'Mobile Money Manager'
    });
})

router.get('/login', (req, res)=>{
    res.render('login', {
        title: 'Login - Mobile Money Manager'
    })
})

router.post('/login', async(req, res)=>{
    if(!req.body){
        throw new Error("found no user information")
    }

    try {

        const users = await logindetails();
        
        
    } catch (error) {
        throw new Error("Network Errro"+ error)
    }

})

module.exports = router