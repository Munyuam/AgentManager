const pool = require('../db/dbconnector');

const getTransactions = async (agentID) => {
    const feeRate = 0.3;
    const agentCommissionRate = 0.3;

    try {
        const sql = `
            SELECT i.*, o.*
            FROM dailyCashIn i
            JOIN dailyCashOut o 
            ON i.transactionID = o.transactionID
            WHERE i.agentID = ?
        `;
        
        const [rows] = await pool.query(sql, [agentID]);

        if (rows.length === 0) {
            return {
                success: false,
                message: "No transactions found"
            };
        }

        console.log(rows);

        const transactions = rows.map(transaction => {
            const netCashIn = transaction.closingCashBalance - transaction.openingCashBalance;
            const netCashOut = transaction.openingMobileBalance - transaction.closingMobileBalance;

            const totalFee = netCashOut * feeRate;
            const commission = netCashOut - totalFee;
            const agentCommission = totalFee * agentCommissionRate;

            return {
                ...transaction,
                netCashIn,
                netCashOut,
                totalFee,
                commission,
                agentCommission
            };
        });

        return {
            success: true,
            data: transactions
        };

    } catch (error) {
        return {
            success: false,
            message: "Server Error: " + error.message
        };
    }
};

module.exports = getTransactions;