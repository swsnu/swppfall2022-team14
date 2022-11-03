import './App.css';
import InitPage from './InitPage/InitPage';
import ItemDetailPage from './ItemDetailPage/ItemDetailPage';
import CreateCustomPage from './CreateCustomPage/CreateCustomPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dum from "./Dum/Dum";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InitPage />} />
          <Route path='/custom/create' element={<CreateCustomPage />} />
          <Route path="/:type/:id" element={<ItemDetailPage />} />
          <Route path="/dum" element={<Dum />} />
        </Routes>
      </BrowserRouter >
    </div >
  );
}

export default App;