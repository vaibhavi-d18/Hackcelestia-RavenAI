const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/task-management-app', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

// Authentication
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  res.send({ message: 'User created successfully' });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).send({ message: 'Invalid username or password' });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).send({ message: 'Invalid username or password' });
  const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
  res.send({ token });
});

// Tasks API
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, userId } = req.body;
  const task = new Task({ title, description, userId });
  await task.save();
  res.send({ message: 'Task created successfully' });
});

app.get('/api/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  if (!task) return res.status(404).send({ message: 'Task not found' });
  res.send(task);
});

app.put('/api/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const task = await Task.findByIdAndUpdate(id, { title, description }, { new: true });
  res.send(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const id = req.params.id;
  await Task.findByIdAndRemove(id);
  res.send({ message: 'Task deleted successfully' });
});

// Users API
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).send({ message: 'User not found' });
  res.send(user);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});