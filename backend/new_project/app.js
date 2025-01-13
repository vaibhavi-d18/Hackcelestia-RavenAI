const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost/task-management', { useNewUrlParser: true, useUnifiedTopology: true });

const taskSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  dueDate: { type: Date },
  completed: { type: Boolean }
});

const Task = mongoose.model('Task', taskSchema);

// Create task
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get task by ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).send({ message: 'Task not found' });
    } else {
      res.send(task);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update task
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndRemove(req.params.id);
    res.status(204).send({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String }
});

const User = mongoose.model('User', userSchema);

// Create user
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send({ message: 'User not found' });
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update user
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.status(204).send({ message: 'User deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});