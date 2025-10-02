const express = require('express');
const router = express.Router();
const logindetails = require('../services/loginddetails');
const submitTransactions = require('../services/submitTransactions')
const updateProfile = require('../services/updateProfile');
const getTransactions = require('../services/transactions')
const searchTransactions = require('../services/searchTransactions')
const getAgents = require('../services/getAgents');
const agentBusinessDetails = require('../services/businessAnalytics')
const deleteItem = require('../services/deleteItem')
const createAgent = require('../services/createAgent')
const { render } = require('ejs');
const { query } = require('../db/dbconnector');

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
                } 
                else {
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

router.get('/manager/dashboard', async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send("This resource is restricted to Managers only");
  }

  try {
    const businessdetails = await agentBusinessDetails();

    if (businessdetails.success) {
      
        return res.render('managerdashboard', {
            title: 'Dashboard - Manager',
            user: req.session,
            businessdetails: businessdetails.data
      });
    } else {
      return res.status(500).send("Network Error: Failed to fetch data from the database");
    }

  } catch (error) {
    console.error("Network Error:", error);
    return res.status(500).send("Internal Server Error: " + error.message);
  }
});


router.get('/manager/agents', async (req, res) => {

    if (!req.session.userId) {
        return res.status(403).send("This Information is restricted to manager only");
    }

    const getagents = await getAgents();

    console.log(getagents)
    
    if(getagents.success){
        res.render('manager/agents',{
            title: 'Manager - agents',
            agents: getagents.agents
        })
    }else{
        res.render('manager/agents',{
            title: 'Manager - agents',
            agents: []
        })
    }
   
});

router.get('/manager/new', async (req, res) => {

    if (!req.session.userId) {
        return res.status(403).send("This Information is restricted to manager only");
    }
    
    res.render('manager/addAgent',{
        title: 'Manager - new agent'
    })
});

router.post('/newagent', async(req, res)=>{
   
    if(!req.body){
        return res.status(403).send("No details where found to create a new agent");
    }

    const {username, agentcode, phonenumber, password}= req.body;


    try {
        
        const newAgent = await createAgent(username,agentcode,phonenumber,password);

        if(newAgent.success){
            return res.redirect('/manager/agents?success?=agent+created+successfully');
        }else{
            return res.send(newAgent.message)
        }

    } catch (error) {
        console.log(error)
        return {
            success: 'false',
            message: 'Network Error'
        }
    }

})



router.get('/delete/:id', async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'Resource could not be identified'
        });
    }

    try {
        const deletedItem = await deleteItem(userId);

        if(deletedItem.success){
            return res.redirect('/manager/agents?success=agent+deleted+successfully');
        }else{
            return res.send(deletedItem.message)
        }

    } catch (error) {
        console.error("Failed to delete Item:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to delete item"
        });
    }
});


router.get('/update/:id', async (req, res)=>{

    const userId = req.params.id
    const getagents = await getAgents(userId);

    console.log(getagents.agents)
    
    if(getagents.success){
        res.render('manager/updateAgent', {
            title: 'Manager-edit agent',
            user: getagents.agents
     })
    }

    else{
        res.render('manager/updateAgent', {
            title: 'Manager-edit agent',
            user: []
        })
    }
});


router.post('/update/:id', async (req, res)=>{

    const userId = req.params.id;

    const {username, agentcode,phonenumber, password } = req.body;
    
    if(!userId && ! req.body){
        return res.send('user Id or data was not Found');
    }

    const updatedProfile = await updateProfile(username,phonenumber,userId,agentcode,password);
    
    if(updatedProfile.success){
        return res.redirect('/manager/agents?success=agent+updated+successfully');
    }
    else{
        return res.send(updatedProfile.message)
    }  
})


router.get('/manager/analytics', async(req, res) => {
    try {

        const businessdetails = await agentBusinessDetails();
        
        console.log(businessdetails);

        if(businessdetails){
            console.log(businessdetails.data)
            return res.render('manager/analytics',{
                title: 'Manager - analytics',  
                data: businessdetails.data
            })
        }else{
            return res.render('manager/analytics',{
                title: 'Manager - analytics',  
                data: []
            })
        }

        
    } catch (error) {    
        console.log(error);
       res.render('manager/analytics',{
            title: 'Manager - analytics',
            data : []
        }) 
    }
   
    res.render('manager/analytics',{
        title: 'Manager - analytics'
    })
});

router.get('/manager/commissions', (req, res) => {
   
    res.render('manager/commissions',{
        title: 'Manager - commissions'
    })
});

router.get('/manager/transactions', async(req, res) => {

    if(req.query){
        try {
            const searchQuery = req.query.agentcode;

            if(!searchQuery){
                return res.render('manager/reports',{
                    title: 'Manager - reports',
                    query: [],
                    error: 'Invalid Agent Code entered' 
                })
            }

            const transactions = await searchTransactions(searchQuery)
                      
            console.log(transactions.data)

            if(transactions.data.length > 0){
                return res.render('manager/reports',{
                    title: 'Manager - reports',
                    query: transactions.data,
                    message: 'search query has been made successully' 
                })
            }

            return res.render('manager/reports',{
                    title: 'Manager - reports',
                    query: [],
                    message: 'found successfully' 
            })
     
        } catch (error) {
            console.log("An error occurred while searching: "+ error)
            
            return res.render('manager/reports',{
                title: 'Manager - reports',
                error: 'Something occured happened, while searching for data' 
            })
        }

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
            title: 'Agent - Transaction Cards',
            user: req.session
        });
    }

    else{
        return res.status(500).send("Agent was not found to access this Information")
    }

});

router.get('/agent/profiles', (req, res) => {
    const { success, error } = req.query;  
    
    if (req.session.agentId) {
       
        return res.render('agent/profiles', {
            title: 'Agent - Profiles',
            user: req.session,
            success,
            error
        });
        
    } else {
        return res.status(500).send("Agent was not found to access this Information");
    }
});



router.post('/updateProfile', async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Invalid Data Entered into the form");
  }

  const { username, phonenumber,agentcode,userId } = req.body;

  try {
    const updatedProfile = await updateProfile(username, phonenumber,userId,agentcode);

    if (!updatedProfile.success) {
      return res.status(500).send(updatedProfile.message);
    }

    res.redirect('/agent/profiles?success=profile+updated+successfully',);
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