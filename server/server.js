const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/tasks', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const taskSchema = new mongoose.Schema({
    title: String,
    firstName: String,
    lastName: String,
    position: String,
    company: String,
    businessArena: String,
    employees: Number,
    street: String,
    additionalInfo: String,
    zipCode: String,
    place: String,
    country: String,
    phoneCode: String,
    phoneNumber: String,
    email: String
});

const Task = mongoose.model('Task', taskSchema);

// CRUD operations
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/tasks/:id', getTask, (req, res) => {
    res.json(res.task);
});

app.put('/tasks/:id', getTask, async (req, res) => {
    Object.assign(res.task, req.body);
    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/tasks/:id', getTask, async (req, res) => {
    try {
        await res.task.remove();
        res.json({ message: 'Deleted Task' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Cannot find task' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.task = task;
    next();
}

app.listen(3001, () => {
    console.log('Server started on port 3001');
});
