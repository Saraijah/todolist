import pool from "../database/index.js";
import { comparePasswords } from "../../js/auth.js"; // Assuming this is a custom function for comparing hashed passwords
import jwt from 'jsonwebtoken';

// Secret key for JWT (store this securely in environment variables)
const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

// Function to find user information by email
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM user_table WHERE email = ?';
  const [rows] = await pool.query(query, [email]);
  return rows[0]; // Return the first (and only) user found
};

// Function to find login credentials by user_id
const findLoginCredentialsByUserId = async (userId) => {
  const query = 'SELECT * FROM login_table WHERE user_id = ?';
  const [rows] = await pool.query(query, [userId]);
  return rows[0]; // Return the first (and only) row found
};

// Login user function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Find user by email
    const user = await findUserByEmail(email);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Step 2: Find login credentials using the user_id from user_table
    const loginCredentials = await findLoginCredentialsByUserId(user.user_id);

    if (!loginCredentials) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Step 3: Compare passwords
    const isPasswordValid = await comparePasswords(password, loginCredentials.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Step 4: Generate JWT with only the user_id
    const token = jwt.sign(
      { userId: user.user_id }, // Include only user_id
      secretKey,
      { expiresIn: '2h' } // Token expires in 2 hours
    );

    // Step 5: Store user ID in the session
    req.session.userId = user.user_id;
    console.log('Session userId set:', req.session.userId); // Log the session userId

    // Step 6: Respond with JWT token, user info, and session ID
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      },
      sessionId: req.sessionID // Include session ID in the response
    });
  } catch (error) {
    console.error(`Error logging in: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { loginUser };
