import React from 'react';
import './App.css';
import TodoList from './components/TodoList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h1>To-Do List</h1>
      <main>
        <TodoList />
      </main>
      </header>
    </div>
  );
}

export default App;
