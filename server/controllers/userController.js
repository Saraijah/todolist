import pool from '../database/index.js';
import { hashPassword } from '../../js/auth.js';
// Fetch a user by ID
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;

        // Corrected SQL query syntax
        const sqlQuery = `SELECT * FROM user_table WHERE user_id = ?`;

        // Executing the query with parameterized input
        const [result] = await pool.query(sqlQuery, [id]);

        // Check if a user was found
        if (result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No user found with this ID'
            });
        }

        // Send the result back to the client
        res.status(200).json({
            status: 'success',
            message: 'User successfully retrieved',
            result: result[0] // Assuming you want a single user object, not an array
        });

    } catch (error) {
        console.error(`Error fetching user: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const id = req.params.id;

        // Extract user information from request body
        const { first_name, last_name, email, dob } = req.body;

        // SQL query to update user information in the database
        const sqlQuery = `UPDATE user_table SET first_name = ?, last_name = ?, email = ?, dob = ? WHERE user_id = ?`;

        // Execute the SQL query with user information
        const [result] = await pool.query(sqlQuery, [first_name, last_name, email, dob, id]);

        // If no rows were affected by the update, it means the user with the given ID wasn't found
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: `User with ID ${id} not found`,
            });
        }

        // Send a success response
        res.status(200).json({
            status: 'success',
            message: `User with ID ${id} updated successfully`,
            data: { result: result }
        });

    } catch (error) {
        console.error(`Error updating user: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};




const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, dob, password } = req.body;

        // Step 1: Insert user information into user_table
        const insertUserQuery = `
            INSERT INTO user_table (first_name, last_name, email, dob)
            
            VALUES (?, ?, ?, ?)
        `;

              // Extract the date part from the date string
        const dobDate = dob.split('T')[0];
        const [userResult] = await pool.query(insertUserQuery, [first_name, last_name, email, dobDate]);

        // Step 2: Retrieve the newly inserted userId
        const userId = userResult.insertId;

        // Step 3: Hash the user's password
        const hashedPassword = hashPassword(password);

    

        // Step 4: Insert the hashed password into login_table with the userId
        const insertLoginQuery = `
            INSERT INTO login_table (user_id, password)
            VALUES (?, ?)
        `;
        await pool.query(insertLoginQuery, [userId, hashedPassword]);

        // Step 5: Respond with a success message
        res.status(200).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                userId: userId,
                firstName: first_name,
                lastName: last_name,
                email: email
            }
        });

    } catch (err) {
        console.error(`Error Registering User: ${err.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
        throw err;
    }
};




// Delete a user profile
const deleteProfile = async (req, res) => {
    try {
        const id = req.params.id;

        const sqlQuery = `DELETE FROM user_table WHERE user_id = ?`;

        const [result] = await pool.query(sqlQuery, [id]);

        // If no rows were affected by the delete, it means the user with the given ID wasn't found
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: `User with ID ${id} not found`,
            });
        }

        res.status(200).json({
            status: 'success',
            message: `User with ID ${id} deleted successfully`
        });

    } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

// Exporting functions
export { getUserById , updateProfile, deleteProfile, createUser };

