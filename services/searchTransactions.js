const pool = require('../db/dbconnector');

const searchTransactions = async (agentCode) => {
    const feeRate = 0.3;
    const agentCommissionRate = 0.3;

    try {
        const sql = `
            SELECT 
                i.*,
                o.*,
                a.*,
                u.username,
                u.phoneno,
                u.role
            FROM dailyCashIn i
            INNER JOIN dailyCashOut o 
                ON i.transactionID = o.transactionID
            INNER JOIN agents a 
                ON a.agentID = i.agentID
            INNER JOIN users u
                ON a.userID = u.userID
            WHERE a.agentcode = ?
            GROUP BY a.agentcode, u.username, u.phoneno, u.role
        `;
        
        const [rows] = await pool.query(sql, [agentCode]);

        if (rows.length === 0) {
            return {
                success: false,
                message: "No transactions found",
                data: []
            };
        }
        
        const transactions = rows.map(transaction => {
            const netCashIn = transaction.closingCashBalance - transaction.openingCashBalance;
            const netCashOut = transaction.openingMobileBalance - transaction.closingMobileBalance;

            const totalFee = netCashOut * feeRate;
            const agentCommission = totalFee * agentCommissionRate;
            const companyEarnings = totalFee - agentCommission;

            return {
                ...transaction,
                netCashIn,
                netCashOut,
                totalFee,
                agentCommission,
                companyEarnings
            };
        });

        return {
            success: true,
            data: transactions
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Server Error: " + error.message,
            data: []
        };
    }
};

module.exports = searchTransactions;
