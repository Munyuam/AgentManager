const pool = require('../db/dbconnector');

const logindetails = async (username = null, password, agentcode = null) => {
  try {
    let role = agentcode ? 'agent' : 'manager';
    console.log("Role detected:", role);
    console.log("Agent code:", agentcode);

    if (role === "agent") {
      const [agentRows] = await pool.query(
        `SELECT a.*, u.username, u.role 
         FROM agents a
         JOIN users u ON a.userID = u.userID
         WHERE a.agentcode = ? AND u.password = ?`,
        [agentcode, password]
      );

      if (agentRows.length > 0) {
        console.log("Agent login success:", agentRows[0].agentcode);
        return { success: true, role: "agent", user: agentRows[0] };
      } else {
        return { success: false, message: "Invalid agent code or password" };
      }
    } 
    else {
      const [managerRows] = await pool.query (
        "SELECT * FROM users WHERE username = ? AND password = ? AND role = 'manager'",
        [username, password]
      );

      if (managerRows.length > 0) {
        return { success: true, role: "manager", user: managerRows[0] };
      } else {
        return { success: false, message: "Invalid username or password" };
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Server error: " + error.message };
  }
};

module.exports = logindetails;
