import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import ReactModal from 'react-modal';
import { store } from './store';
import './index.css';
import App from './App'; import { ToastContainer } from "react-toastify";
import reportWebVitals from './reportWebVitals';
import axios from 'axios';


ReactModal.setAppElement('#root');
//axios.defaults.baseURL = 'https://qualla.kro.kr/';
axios.defaults.baseURL = 'http://localhost:8000/';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
