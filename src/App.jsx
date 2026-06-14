import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Alert from './pages/Alert';
import Profile from './pages/Profile';
import Register from './pages/Register';
import AlertStatus from './pages/AlertStatus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alert" element={<Alert />} />
        <Route path="/alert-status" element={<AlertStatus />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

    
  


