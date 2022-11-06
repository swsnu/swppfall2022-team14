import './App.css';
import InitPage from './InitPage/InitPage';
import ItemDetailPage from './ItemDetailPage/ItemDetailPage';
import CreateCustomPage from './CreateCustomPage/CreateCustomPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ListPage from "./ListPage/ListPage";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InitPage />} />
            <Route path="/:type" element={<ListPage />} />
          <Route path='/custom/create' element={<CreateCustomPage />} />
          <Route path="/:type/:id" element={<ItemDetailPage />} />
        </Routes>
      </BrowserRouter >
    </div >
  );
}

export default App;