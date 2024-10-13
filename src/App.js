import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LayoutComponent from './components/Layout/Layout';
import ResultPage from './components/ResultPage/ResultPage';
import LoginPage from './components/LoginPage/LoginPage';
import ChatPage from './components/ChatPage/ChatPage';
import AdminPage from './components/AdminPage/AdminPage';
import RegisterForm from './components/RegisterForm/RegisterForm';
import RegisterSuccessful from './components/RegisterForm/RegisterSuccessful';
import UserHomePage from './components/UserHomePage/UserHomePage';
import UserDetailsPage from './components/UserDetailsPage/UserDetailsPage';
import AdminJobPost from './components/AdminPage/AdminJobPost';


function App() {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);

  const handleSetUsername = (username, role) => {
    setUsername(username);
    setRole(role);
  };

  const handleLogout = () => {
    console.log("Logging out");
    setUsername(null);
    setRole(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
             path="/login"
             element={
               username ? (
                 role === 'admin' ? (
                   <Navigate to="/admin" replace />
                 ) : (
                   <Navigate to={`/userhome/${username}`} replace />
                 )
               ) : (
                 <LoginPage setUsername={handleSetUsername} />
               )
             }
           />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/register/:jobId" element={<RegisterForm />} />
          <Route path="/registersuccess" element={<RegisterSuccessful />} />
          <Route path="/userhome/:name" element={<UserHomePage role={role} />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/chat/:name/:interviewId" element={<ChatPage />} />
          <Route path="/test/:userid/:interviewId" element={<LayoutComponent onLogout={handleLogout} />} />
          
          {/* <Route path="/user/:userId" element={<UserDetails />} /> */}
          <Route path="/admin" element={username && role === 'admin' ? <AdminPage onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/user/:userId" element={<UserDetailsPage />} />
          <Route path="/jobpost" element={<AdminJobPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
