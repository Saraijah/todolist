import express from 'express';
import { getUserById , updateProfile, deleteProfile, createUser   } from '../controllers/userController.js';

const userRouter = express.Router();

// Route to get all tasks and create a new task
userRouter.route('/')
  .post(createUser);

// Route to update a specific task by ID and delete it
userRouter.route('/:id')
  .get(getUserById)
  .patch(updateProfile)  // Use PATCH for updating resources partially
  .delete(deleteProfile); // Use DELETE for deleting resources

export default userRouter;
