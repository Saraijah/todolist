import express from 'express';
import { getAllTasks, createTask, updateTask, deleteTask } from '../controllers/tasksController.js';

const taskRouter = express.Router();

// Route to get all tasks and create a new task
taskRouter.route('/')
  .get(getAllTasks)
  .post(createTask);

// Route to update a specific task by ID and delete it
taskRouter.route('/:id')
  .patch(updateTask)  // Use PATCH for updating resources partially
  .delete(deleteTask); // Use DELETE for deleting resources

export default taskRouter;
