import './App.css';
import InitPage from './InitPage/InitPage';
import ItemDetailPage from './ItemDetailPage/ItemDetailPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InitPage />} />
          <Route path="/:type/:id" element={<ItemDetailPage />} />
        </Routes>
      </BrowserRouter >
    </div >
  );
}

export default App;