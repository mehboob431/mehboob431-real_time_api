import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import store from './redux/store';
import { ContextProvider } from './contexts/ContextProvider';
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ContextProvider>
        <AuthProvider>
                  <App />
        </AuthProvider>
      </ContextProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);
