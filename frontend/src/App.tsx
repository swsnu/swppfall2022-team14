import './App.css';
import InitPage from './InitPage/InitPage';
import ItemDetailPage from './ItemDetailPage/ItemDetailPage';
import IngredientDetailPage from './ItemDetailPage/IngredientDetailPage';
import CreateCustomPage from './CreateCustomPage/CreateCustomPage';
import EditCustomPage from './EditCustomPage/EditCustomPage';
import MyPage from './MyPage/MyPage';
import Test from './Test'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ListPage from "./ListPage/ListPage";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main : '#292929',
      light: '#606060',
      dark : '#252525',
    },
    secondary: {
      main : '#313131',
      light: '#ffffff'
    },
    text: {
      primary: '#ffffff',
    },
    background: {
      paper: '#202020',
      default: '#202020'
    }
  },
});

function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<InitPage />} />
            <Route path="/:type" element={<ListPage />} />
            <Route path="/custom/:id/edit" element={<EditCustomPage />} />
            <Route path='/custom/create' element={<CreateCustomPage />} />
            <Route path="/ingredient/:id" element={<IngredientDetailPage />} />
            <Route path="/:type/:id" element={<ItemDetailPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </BrowserRouter >
      </div >
    </ThemeProvider>
  );
}

export default App;