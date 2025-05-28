import express from 'express';
import { Op } from 'sequelize';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['dueDate', 'ASC']]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, dueDate, priority, category } = req.body;

  // Simple validation
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const newTask = await Task.create({
      userId: req.user.id,
      title,
      description: description || '',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      category: category || 'general',
      completed: false
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, dueDate, priority, category, completed } = req.body;
  const taskId = req.params.id;

  try {
    // Find the task
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (completed !== undefined) task.completed = completed;

    // Save the updated task
    const updatedTask = await task.save();
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const taskId = req.params.id;

  try {
    // Find the task
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete the task
    await task.destroy();
    
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/tasks/search
// @desc    Search tasks by title or description
// @access  Private
router.get('/search', auth, async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ]
      },
      order: [['dueDate', 'ASC']]
    });

    res.json(tasks);
  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
