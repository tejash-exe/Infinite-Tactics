import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/context.jsx';
import App from './App.jsx';
import Home from './pages/home/Home.jsx';
import OfflineGame from './pages/offlineGame/OfflineGame.jsx';
import OnlineGame from './pages/onlineGame/OnlineGame.jsx';
import Leaderboard from './pages/leaderboard/Leaderboard.jsx';
import PageNotFound from './pages/pagenotfound/PageNotFound.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true, // This means when the parent ("/") is matched, this route will be rendered
        element: <Navigate to="/home" replace />, // Redirect to /home
      },
      {
        path: 'home/',
        element: <Home />,
      },
      {
        path: 'offline/',
        element: <OfflineGame/>,
      },
      {
        path: 'online/',
        element: <OnlineGame/>,
      },
      {
        path: 'leaderboard/',
        element: <Leaderboard/>,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='50872906671-1fv7far1q3ulr07l8upnjro3fe7qpvj3.apps.googleusercontent.com'>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
