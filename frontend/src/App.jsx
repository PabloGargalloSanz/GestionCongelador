import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
// import DashboardPage from './pages/dashboard/DashboardPage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<div> Dashboard</div>} />
      </Routes>
    </Router>
  );
}

export default App;