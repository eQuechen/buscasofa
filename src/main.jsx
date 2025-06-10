import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@styles/variables.css';
import '@styles/index.css';

import App from './App.jsx'
import { UserProvider } from './contexts/UserContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </StrictMode>
)
