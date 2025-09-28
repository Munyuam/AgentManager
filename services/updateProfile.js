const pool = require('../db/dbconnector');

const updateProfile = async (username, phonenumber, userId) => {
  try {
    const sql = "UPDATE users SET phoneno = ?, username = ? WHERE userID = ?";
    const [result] = await pool.query(sql, [phonenumber, username, userId]);

    if (result.affectedRows > 0) {
      return {
        success: true,
        message: "Data updated successfully"
      };
    } else {
      return {
        success: false,
        message: "No record updated. Check userID."
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Server Error: " + error.message
    };
  }
};

module.exports = updateProfile;
