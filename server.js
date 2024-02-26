// server.js
// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const MONGODB_URI = 'mongodb+srv://sukhavasimeghana:meenu1399@cluster0.meazzqw.mongodb.net/<database>';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

const todoItemSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
    date: Date,
});

const ToDoItem = mongoose.model('ToDoItem', todoItemSchema);

app.get('/api/todos', async (req, res) => {
    try {
        const todos = await ToDoItem.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/todos', async (req, res) => {
    const todo = new ToDoItem({
        text: req.body.text,
        date: req.body.date, 
        completed: req.body.completed || false,
    });
    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        // Use findOneAndDelete to find and delete the document by its ID
        const deletedTodo = await ToDoItem.findOneAndDelete({ _id: req.params.id });

        // Check if a document was found and deleted
        if (!deletedTodo) {
            return res.status(404).json({ message: 'ToDoItem not found' });
        }

        res.json({ message: 'Deleted ToDoItem', deletedTodo });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

