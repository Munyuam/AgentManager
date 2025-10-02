const pool = require('../db/dbconnector');

const createAgent = async (username, agentcode, phonenumber, password) => {
    const role = 'agent';

    try {
        if (username && agentcode && phonenumber && password) {
            const sql = `INSERT INTO users (username, phoneno, password, role) VALUES (?, ?, ?, ?)`;
            const [result] = await pool.query(sql, [username, phonenumber, password, role]);

            if (result.affectedRows > 0) {
                const userId = result.insertId;

                const query = `INSERT INTO agents (userID, agentcode) VALUES (?, ?)`;
                const [result_set] = await pool.query(query, [userId, agentcode]);

                if (result_set.affectedRows > 0) {
                    return {
                        success: true,
                        message: 'Agent successfully created'
                    };
                } else {
                    return {
                        success: false,
                        message: 'Agent created in users but not in agents table'
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'Failed to create agent in users table'
                };
            }
        } else {
            return {
                success: false,
                message: 'Some fields might be empty'
            };
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = createAgent
