const express = require('express');
const router = express.Router();
const logindetails = require('../services/loginddetails');
const submitTransactions = require('../services/submitTransactions')
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
    } catch (error) {
        res.status(500).render('login', {
            title: 'Login - Mobile Money Manager',
            error: 'Network Error: ' + error.message
        });
    }
});

router.get('/manager/dashboard', (req, res) => {
    res.render('managerdashboard', {
        title: 'Dashboard - Manager',
        user: req.session
    });
});

router.get('/agent/dashboard', (req, res) => {
    res.render('agentdashboard', {
        title: 'Dashboard - Agent',
        user: req.session
    });
});

router.get('/agent/commissions', (req, res) => {
    res.render('agent/commissions', {
        title: 'Agent - commissions',
        user: req.session
    });
});

router.get('/agent/reports', (req, res) => {
    res.render('agent/reports', {
        title: 'Agent - Reports',
        user: req.session
    });
});

router.get('/agent/profiles', (req, res) => {
    res.render('agent/profiles', {
        title: 'Agent - Profiles',
        user: req.session
    });
});

router.post('/dailyTransactions', async (req, res) => {
  
    if (!req.body) {
        return res.status(400).send("Invalid Data Entered into the form");
    }

  const agentID = req.session.agentId; 
  const { reportdate, transactionID, openingMobileBalance, openingCashBalance, closingMobileBalance, closingCashBalance } = req.body;

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

    res.redirect('/agent/reports');

  } catch (error) {
    res.status(500).send("Network Error: " + error.message);
  }
});


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('login', {
                title: 'Login - Mobile Money Manager',
                error: 'Logout failed'
            });
        }
        res.render('login', {
            title: 'Login - Mobile Money Manager'
        });
    });
});

module.exports = router;