import './App.css';
import InitPage from './InitPage/InitPage';
import ItemDetailPage from './ItemDetailPage/ItemDetailPage';
import IngredientDetailPage from './ItemDetailPage/IngredientDetailPage';
import CreateCustomPage from './CreateCustomPage/CreateCustomPage';
import EditCustomPage from './EditCustomPage/EditCustomPage';
import MyPage from './MyPage/MyPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ListPage from "./ListPage/ListPage";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Divider, Stack } from "@mui/material";
import NavBar from "./NavBar/NavBar";
import MainPage from "./MainPage/MainPage";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#292929',
      light: '#606060',
      dark: '#252525',
    },
    secondary: {
      main: '#313131',
      light: '#ffffff',
      dark: '#111111'
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
    background: {
      paper: '#202020',
      default: '#202020',
    },
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
            <Route path="/*" element={<MainPage />} />
          </Routes>
        </BrowserRouter >
        {/*<BrowserRouter>*/}
        {/*  <Routes>*/}
        {/*    <Stack direction="row" justifyContent="space-between" divider={<Divider orientation="vertical" flexItem />}>*/}
        {/*      <NavBar />*/}
        {/*      <Route path="/:type" element={<ListPage />} />*/}
        {/*      <Route path="/custom/:id/edit" element={<EditCustomPage />} />*/}
        {/*      <Route path='/custom/create' element={<CreateCustomPage />} />*/}
        {/*      <Route path="/ingredient/:id" element={<IngredientDetailPage />} />*/}
        {/*      <Route path="/:type/:id" element={<ItemDetailPage />} />*/}
        {/*      <Route path="/mypage" element={<MyPage />} />*/}
        {/*    </Stack>*/}
        {/*  </Routes>*/}
        {/*</BrowserRouter>*/}
      </div >
    </ThemeProvider>
  );
}

export default App;