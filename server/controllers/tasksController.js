import pool from '../database/index.js';

const getAllTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const offset = (page - 1) * limit;

        const sqlQuery = 'SELECT * FROM tasks LIMIT ?, ?';
        console.log('SQL Query:', sqlQuery);
        const [result] = await pool.query(sqlQuery, [offset, limit]);

        const totalCountQuery = 'SELECT COUNT(*) AS total FROM tasks';
        const [totalCountRows] = await pool.query(totalCountQuery);
        const totalRecords = totalCountRows[0].total;

        if (result.length === 0) {
            throw new Error('No tasks found');
        }

        const jsonResponse = {
            status: 'success',
            result: result.length,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: page,
            data: { result: result },
            totalItems: totalRecords
        };

        console.log('JSON Response:', JSON.stringify(jsonResponse, null, 2));
        res.status(200).json(jsonResponse);

    } catch (err) {
        console.error(`Error retrieving tasks: ${err.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, status,scheduled_date,scheduled_time } = req.body;

        // Insert the task into the database
        const insertQuery = `
            INSERT INTO tasks (title, description, status,scheduled_date,scheduled_time)
            VALUES (?, ?, ?, ?,?)
        `;
        const [result] = await pool.query(insertQuery, [title, description, status,scheduled_date,scheduled_time]);

        // Retrieve the newly inserted task ID
        const taskId = result.insertId;

        // Respond with the task ID
        res.status(200).json({
            status: 'success',
            message: 'Task successfully created',
            data: {
                task_id: taskId
            }
        });

    } catch (err) {
        console.error(`Error creating task: ${err.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
        throw err;
    }
};

const updateTask = async (req, res) => {
    try {
        const id = req.params.id;

        // Extract task information from request body
        const {title, description, status, scheduled_date, scheduled_time } = req.body;

        // SQL query to update task information in the database
        const sqlQuery = `UPDATE tasks SET Title=?, Description=?, Status=? scheduled_date=?, scheduled_time=? WHERE task_id=?`;

        // Execute the SQL query with task information
        const [result] = await pool.query(sqlQuery, [title, description, status, scheduled_date, scheduled_time, id]);

        // If no rows were affected by the update, it means the task with the given ID wasn't found
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Task with ID ${id} not found`

            });
        }

        // Send a success response with updated task information
        res.status(200).json({
            status: 'success',
            message: `Task with ID ${id} updated successfully`,
            data: { result: result }
        });

    } catch (error) {
        console.error(`Error updating task: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;

        const sqlQuery = `DELETE FROM tasks WHERE task_id=?`;

        const [result] = await pool.query(sqlQuery, [id]);

        // If no rows were affected by the delete, it means the task with the given ID wasn't found
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Task with ID ${id} not found`,
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Task with ID ${id} deleted successfully`,
            data:{result:result}
        });

    } catch (err) {
        console.error(`Error deleting task: ${err.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
        throw err;
    }
};

export { getAllTasks, createTask, updateTask, deleteTask };
