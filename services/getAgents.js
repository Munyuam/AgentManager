const pool = require('../db/dbconnector');

const getAgents = async (userId = null) => {
  try {
    let sql, params;

    if (!userId) {
      sql = `
        SELECT u.*, a.*
        FROM users u
        JOIN agents a ON a.userID = u.userID
        WHERE u.role = ?
      `;
      params = ['agent'];
    } else {
      sql = `
        SELECT u.*, a.*
        FROM users u
        JOIN agents a ON a.userID = u.userID
        WHERE u.role = ? AND u.userID = ?
      `;
      params = ['agent', userId];
    }

    const [result] = await pool.query(sql, params);

    if (result.length > 0) {
      return {
        success: true,
        agents: result, 
      };
    } else {
      return {
        success: false,
        message: 'No agents found',
      };
    }

  } catch (error) {
    console.error("Database error:", error.message);
    return {
      success: false,
      message: 'Database Error',
    };
  }
};

module.exports = getAgents;
