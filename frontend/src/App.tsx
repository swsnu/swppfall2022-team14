import React from 'react';
import logo from './logo.svg';
import './App.css';
import InitPage from './InitPage/InitPage';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <InitPage />
      </BrowserRouter>

    </div>
  );
}

export default App;
