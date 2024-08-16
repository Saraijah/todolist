import express from 'express';
import { loginUser } from '../controllers/loginController.js';
import { authenticateToken } from '../../middle.wear/jwt.js';

const authRouter = express.Router();


// Define the authentication route for patients
authRouter.post('/', loginUser);
authRouter.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You have access to this protected route' });
  });
  

export default authRouter;
