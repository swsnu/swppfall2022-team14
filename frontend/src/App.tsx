import './App.css';
import InitPage from './InitPage/InitPage';
import ItemDetailPage from './ItemDetailPage/ItemDetailPage';
import IngredientDetailPage from './ItemDetailPage/IngredientDetailPage';
import CreateCustomPage from './CreateCustomPage/CreateCustomPage';
import MyPage from './MyPage/MyPage';
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
          <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
          <Route path="/:type/:id" element={<ItemDetailPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </BrowserRouter >
    </div >
  );
}

export default App;