const pool = require('../db/dbconnector');

const agentBusinessDetails = async () => {
    const feeRate = 0.3;
    const agentCommissionRate = 0.3;

    try {
        const sql = `
            SELECT 
                a.agentcode,
                u.username,
                u.phoneno,
                u.role,
                SUM(o.closingCashBalance - i.openingCashBalance) AS totalNetCashIn,
                SUM(i.openingMobileBalance - o.closingMobileBalance) AS totalNetCashOut
            FROM dailyCashIn i
            INNER JOIN dailyCashOut o 
                ON i.transactionID = o.transactionID
            INNER JOIN agents a 
                ON a.agentID = i.agentID
            INNER JOIN users u
                ON a.userID = u.userID
        `;
        
        const [rows] = await pool.query(sql);

        console.log("rows from the database: "+ rows.affectedRows)

        if (rows.length === 0) {
            return {
                success: false,
                message: "No transactions found",
                data: []
            };
        }

        const transactions = rows.map(agent => {
            const totalFee = agent.totalNetCashOut * feeRate;
            const agentCommission = totalFee * agentCommissionRate;
            const companyEarnings = totalFee - agentCommission;

            return {
                agentCode: agent.agentcode,
                agentName: agent.username,
                phone: agent.phoneno,
                role: agent.role,
                totalNetCashIn: agent.totalNetCashIn,
                totalNetCashOut: agent.totalNetCashOut,
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

module.exports = agentBusinessDetails;
