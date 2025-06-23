import { createRoot } from 'react-dom/client'
import './index.css'
import './js/config/cmmn.js' // 공통 기능 import
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <App />
)
