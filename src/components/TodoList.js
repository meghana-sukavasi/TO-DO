// TodoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa'; 


const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    const taskDate = new Date(date);
    if (isSameDay(taskDate, today)) {
      return "Today";
    } else if (isSameDay(taskDate, tomorrow)) {
      return "Tomorrow";
    } else {
      return taskDate.toLocaleDateString(); // Format date however you like
    }
  };
  
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const BASE_URL = 'http://localhost:5000/api/todos';

  const fetchTodos = async () => {
    try {
      const response = await axios.get(BASE_URL);
      console.log(response.data);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
};

  const handleAddTodo = async () => {
    if (!newTodoText.trim() || !selectedDate) return; 
    try {
      await axios.post(BASE_URL, { text: newTodoText, date: selectedDate, completed: false });
      fetchTodos();
      setNewTodoText(''); 
      selectedDate(''); 
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  

  return (
    <div className="todo-container">
      <div className="todo-list">
        <h2>Tasks</h2>
        <ul className="task-list">
        {todos.map(todo => (
            <li key={todo._id} className="task-item">
            <div className="task-info">
            <p className="task-name times-new-roman">{todo.text}</p>
            <p className="task-date times-new-roman">{formatDate(todo.date)}</p>
            </div>
            <button onClick={() => handleDeleteTodo(todo._id)}>Done</button>
            </li>
        ))}
        </ul>
      </div>
      <div className="add-todo">
      <h2>Add Task</h2>
      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="Enter task..."
      />
      <div className="date-picker-container">
        <FaCalendarAlt className="calendar-icon" /> {/* Calendar icon */}
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          timeCaption="Time"
        />
      </div>
      <button onClick={handleAddTodo}>Add Task</button>
    </div>
    </div>
  );
};

export default TodoList;
