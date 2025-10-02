const pool = require('../db/dbconnector');

const updateProfile = async (username, phonenumber, userId, agentcode, password = null) => {
  
  try {
    let sql;
    let result

    if(password){
        sql = "UPDATE users SET phoneno = ?, username = ?, password = ? WHERE userID = ?";
        [result] = await pool.query(sql, [phonenumber, username,password, userId]);
    }else{
        sql = "UPDATE users SET phoneno = ?, username = ? WHERE userID = ?";
        [result] = await pool.query(sql, [phonenumber, username, userId]);
    }

    if (result.affectedRows > 0) {

      const query = "UPDATE agents SET agentcode = ? WHERE userID = ?";
      const [result_set] = await pool.query(query, [agentcode, userId]);

      if(result_set.affectedRows > 0){
        return {
          success: true,
          message: "Data updated successfully"
        };
      }else{
        return {
          success: false,
          message: 'Data was updated successfully in users but not in agents'
        }
      }
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
