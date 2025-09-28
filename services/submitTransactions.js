const pool = require('../db/dbconnector');

const submitTransactions = async (agentId,reportdate,transactionId,openingCashBalance,openingMobileBalance,closingCashBalance,closingMobileBalance) => {
  try {
    agentId = agentId ?? null;
    reportdate = reportdate ?? null;
    transactionId = transactionId ?? null;
    openingCashBalance = openingCashBalance ?? null;
    openingMobileBalance = openingMobileBalance ?? null;
    closingCashBalance = closingCashBalance ?? null;
    closingMobileBalance = closingMobileBalance ?? null;

    let results = [];

    if (openingCashBalance && openingMobileBalance && !closingCashBalance && !closingMobileBalance) {
      const sql = `INSERT INTO dailyCashIn 
                    (agentID, cashInDate, openingCashBalance, openingMobileBalance, transactionID) 
                    VALUES (?, ?, ?, ?, ?)`;
      const values = [agentId, reportdate, openingCashBalance, openingMobileBalance, transactionId];
      const [result] = await pool.execute(sql, values);
      results.push(result);
    } 
    else if (closingCashBalance && closingMobileBalance && !openingCashBalance && !openingMobileBalance) {
      const sql = `INSERT INTO dailyCashOut 
                    (cashInDate, closingCashBalance, closingMobileBalance, transactionID) 
                    VALUES (?, ?, ?, ?)`;
      const values = [reportdate, closingCashBalance, closingMobileBalance, transactionId];
      const [result] = await pool.execute(sql, values);
      results.push(result);
    } 
    else if (openingCashBalance && openingMobileBalance && closingCashBalance && closingMobileBalance) {
      const sql1 = `INSERT INTO dailyCashIn 
                    (agentID, cashInDate, openingCashBalance, openingMobileBalance, transactionID) 
                    VALUES (?, ?, ?, ?, ?)`;
      const values1 = [agentId, reportdate, openingCashBalance, openingMobileBalance, transactionId];

      const sql2 = `INSERT INTO dailyCashOut 
                    (cashInDate, closingCashBalance, closingMobileBalance, transactionID) 
                    VALUES (?, ?, ?, ?)`;
      const values2 = [reportdate, closingCashBalance, closingMobileBalance, transactionId];

      const [result1] = await pool.execute(sql1, values1);
      const [result2] = await pool.execute(sql2, values2);
      results.push(result1, result2);
    } 
    else {
      throw new Error("Invalid data for transaction");
    }

    return { success: true, transactionId, results };
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
};

module.exports = submitTransactions