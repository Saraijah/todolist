import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
// import morgan from 'morgan'; // Uncomment if you want request logging

// Importing Routes
import taskRouter from './server/routes/tasksRoute.js';
import userRouter from './server/routes/userRoutes.js';
import authRouter from './server/routes/auth.js';
// Configuring dotenv
dotenv.config();

// Configuring express
const app = express();

// Setting up static folder
app.use(express.static('Public'));

// Setting up session
app.use(session({
    secret: process.env.SESSION_SECRET || '!45jhkl45l$54600kl?', // Use environment variable for secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

// Handle preflight requests
app.options('*', cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '5kb' }));
app.use(express.urlencoded({ extended: true, limit: '5kb' }));

// Uncomment for request logging
// if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Route Specifications
app.use('/api/v1/planPal/services/tasks', taskRouter);
app.use('/api/v1/planPal/services/users', userRouter);

//logn Router
app.use('/api/v1/planPal/services/login/users', authRouter);

// Start the server
const port = process.env.PORT || 6560;
const server = app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
