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

        const username = req.body.username;
        const password = req.body.password;
        const agentcode = req.body.agentcode

        const users = await logindetails(username, password, agentcode);

        if(users.success){
            res.json({
                success: true,
                message: "Login successfull"
            })
        }
        else{
            res.json({
                success: false,
                message: "wrong password or username"
            }) 
        }
          
    } catch (error) {
        throw new Error("Network Errro"+ error)
    }

})

router.get('/manager/dashboard', (req, res)=>{
   
    res.render('managerdashboard',{
        title : 'Dashboard - Manager'
    }) 

})

router.get('/agent/dashboard', (req, res)=>{
   
    res.render('agentdashboard',{
        title : 'Dashboard - Agent'
    }) 

})


module.exports = router