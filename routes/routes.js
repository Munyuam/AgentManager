const express = require('express');
const router = express.Router();
const logindetails = require('../services/loginddetails');
const submitTransactions = require('../services/submitTransactions')
const updateProfile = require('../services/updateProfile');
const getTransactions = require('../services/transactions')
const { render } = require('ejs');

router.get('/', (req, res) => {
    res.render('main', {
        title: 'Mobile Money Manager'
    });
});

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login - Mobile Money Manager'
    });
});

router.post('/login', async (req, res) => {
    
    if (!req.body) {
        throw new Error("found no user information");
    }

    const username = req.body.username;
    const password = req.body.password;
    const agentcode = req.body.agentcode;

    try {
        const users = await logindetails(username, password, agentcode);
        console.log(users);
        if (users.success && users.user) {
            req.session.role = users.user.role;
            req.session.agentId = users.user.agentID;
            req.session.userId = users.user.userID;
            req.session.agentCode = users.user.agentcode;
            req.session.userName = users.user.username;
            req.session.phonenumber = users.user.phoneno;

            req.session.save((error) => {
                if (error) {
                    return res.status(500).render('login', {
                        title: 'Login - Mobile Money Manager',
                        error: 'Internal Server Error',
                    });
                }

                const role = users.user.role;

                if (role === 'agent') {
                    res.redirect('/agent/dashboard');
                } else if (role === 'manager') {
                    res.redirect('/manager/dashboard');
                } else {
                    res.render('login', {
                        title: 'Login - Mobile Money Manager',
                        error: 'Invalid user role'
                    });
                }
            });
        } else {
            res.render('login', {
                title: 'Login - Mobile Money Manager',
                error: 'Wrong password, username, or agent code'
            });
        }
    } 
    catch (error) {
        res.status(500).render('login', {
            title: 'Login - Mobile Money Manager',
            error: 'Network Error: ' + error.message
        });
    }
});

router.get('/manager/dashboard', (req, res) => {
    
    if(req.session.agentId){
        return  res.render('managerdashboard', {
            title: 'Dashboard - Manager',
            user: req.session
        });
    }else{
        return res.status(403).send("Agent was not found to access this information");
    }
});

router.get('/agent/dashboard', async(req, res) => {
    
    if (!req.session.agentId) {
        return res.status(403).send("Agent was not found to access this information");
    }

    try {
        const agentID = req.session.agentId; 
        const transaction = await getTransactions(agentID);
        
        if (transaction.success) {
           
            return res.render('agentdashboard', {
                title: 'Dashboard - Agent',
                user: req.session,
                transactions: transaction.data
            });

        } else {
            return res.render('agentdashboard', {
                title: 'Dashboard - Agent',
                user: req.session,
                transactions: []
            });
        }

    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).send("Network Error");
    }
});

router.get('/agent/transactions', async (req, res) => {
   
    if (!req.session.agentId) {
        return res.status(403).send("Agent was not found to access this information");
    }

    try {
        const agentID = req.session.agentId; 
        const transaction = await getTransactions(agentID);
        
        if (transaction.success) {
            return res.render('agent/transactions', {
                title: 'Agent - Transactions',
                user: req.session,
                transactions: transaction.data
            });
        } else {
            return res.render('agent/transactions', {
                title: 'Agent - Transactions',
                user: req.session,
                transactions: []
            });
        }

    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).send("Network Error");
    }
});


router.get('/agent/register', (req, res) => {
   
    if(req.session.agentId){
        return res.render('agent/reports', {
            title: 'Agent - Reports',
            user: req.session
        });
    }

    else{
        return res.status(500).send("Agent was not found to access this Information")
    }

});

router.get('/agent/profiles', (req, res) => {
    
    if(req.session.agentId){
        return res.render('agent/profiles', {
            title: 'Agent - Profiles',
            user: req.session
        });
    }
    else{
        return res.status(500).send("Agent was not found to access this Information")
    }
});

router.post('/updateProfile', async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Invalid Data Entered into the form");
  }

  const { username, phonenumber, userId } = req.body;

  try {
    const updatedProfile = await updateProfile(username, phonenumber, userId);

    if (!updatedProfile.success) {
      return res.status(500).send(updatedProfile.message);
    }

    res.redirect('/agent/profiles');
  } catch (error) {
    res.status(500).send("Network Error: " + error.message);
  }
});

router.post('/dailyTransactions', async (req, res) => {
  
    if (!req.body) {
        return res.status(400).send("Invalid Data Entered into the form");
    }

  const agentID = req.session.agentId; 
  const { reportdate, transactionID, openingMobileBalance, openingCashBalance, closingMobileBalance, closingCashBalance } = req.body;

  console.log(transactionID);

  console.log(req.body)

  let transaction;

  try {
    if (openingCashBalance && openingMobileBalance && !closingCashBalance && !closingMobileBalance) {
      transaction = await submitTransactions(agentID, reportdate, transactionID, openingCashBalance, openingMobileBalance, null, null);
    } 
    else if (closingCashBalance && closingMobileBalance && !openingCashBalance && !openingMobileBalance) {
      transaction = await submitTransactions(agentID, reportdate, transactionID, null, null, closingCashBalance, closingMobileBalance);
    } 
    else if (openingCashBalance && openingMobileBalance && closingCashBalance && closingMobileBalance) {
      transaction = await submitTransactions(agentID, reportdate, transactionID, openingCashBalance, openingMobileBalance, closingCashBalance, closingMobileBalance);
    } 

    else {
      return res.status(400).send("Invalid data Entered into the form");
    }

    res.redirect('/agent/register');

  } catch (error) {
    res.status(500).send("Network Error: " + error.message);
  }
});


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to log out user..");
        }
        res.redirect('/login')
    });
});

module.exports = router;