import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './media.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './js/redux/store.js';
import { AuthProvider } from './js/login/AuthContext.jsx';
import { ModalProvider } from './components/cmmn/ModalContext.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <ModalProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ModalProvider>
  </Provider>
  // </StrictMode>
);
