const pool = require('../db/dbconnector');

const deleteItem = async (userId) => {
    if (!userId) {
        throw new Error("Item Identifier was empty");
    }

    console.log(userId)

    try {
        const [userResult] = await pool.query(
            `DELETE FROM users WHERE userID = ?`,
            [userId]
        );

        if (userResult.affectedRows > 0) {
              return {
                    success: true,
                    message: "Agent was deleted successfully"
                };
    
        } else {
            return {
                success: false,
                message: "No user found with that ID"
            };
        }
    } catch (error) {
        throw new Error("Database error: " + error.message);
    }
};

module.exports = deleteItem;
