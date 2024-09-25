import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUpClient from './components/Sign Up Client/signup_client';
import ChooseRole from './components/Chooserole/chooserole';
import SignUpWorker from './components/Sign Up Worker/signup_worker';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Hero from './components/Hero/Hero.js'
import Contact from "./components/Contact/Contact";
import LogInAdmin from './components/AdminLogin/adminlogin';
import LogInClient from './components/Log In Form/loginform';
import UserManagement from './components/Admin User Worker/AdminWorkerManagement';
import ProtectedRoute from './components/AdminLogin/ProtectedRoute';
import LogInWorker from './components/Log In Worker/loginworker';
import ChooseLogin from './components/Log In Worker/chooselogin';

import WorkerManagement from './components/Worker User/WorkerManagement';
import WorkerProfile from './components/WorkerManagement/WorkerProfile';

import AdminOrdersPage from "./components/Admin Order Control/AdminOrdersPage";
import AdminLayout from './components/Admin Profile/AdminLayout';
import WorkerLayout from './components/Worker User/WorkerLayout.js';
import AdminDashboardPage from './components/Admin Profile/AdminDashboardPage';

import AdminWorkerManagement from "./components/Admin User Worker/AdminWorkerManagement";
import AdminUserManagement from "./components/Admin User Worker/AdminUserManagement"
import WorkerCalendar from './components/Worker User/Worker Calendar/WorkerCalendar.js';
import ReviewsWorker from './components/Worker User/Reviews/Reviews.js';
import ReviewsAdmin from './components/Admin User Worker/Reviews Admin/ReviewsAdmin.js';
import UserCalendarCreateOrder from './components/User Calendar/UserCalendarCreateOrder';

import ClientProfile from './components/Client Profile/ClientProfile';
import Rating from './components/Review/Review';

function App() {
  return (
      <Router>
        <div className="Mesteri">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Hero />} />
              <Route path="/choose" element={<ChooseRole />} />
              <Route path="/chooselogin" element={<ChooseLogin />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/loginclient" element={<LogInClient />} />
              <Route path="/loginworker" element={<LogInWorker />} />
              <Route path="/signupclient" element={<SignUpClient />} />
              <Route path="/signupworker" element={<SignUpWorker />} />
              <Route path="/loginadmin" element={<LogInAdmin />} />

              <Route path="/client-profile" element={<ClientProfile/>}/>
              <Route path="/rating" element={<Rating />} />

              {/* Protected Route */}
            <Route path="/usermanagement" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/user/calendar" element={<UserCalendarCreateOrder/>}/>

              {/* Worker Routes */}
              <Route path="/worker" element={<WorkerLayout/>}>
                <Route path="/worker/profile" element={<WorkerManagement />} />
                <Route path="/worker/profile/management" element={<WorkerProfile />} />
                <Route path="/worker/profile/orders" element={<WorkerCalendar />} />
                <Route path="/worker/profile/reviews" element={<ReviewsWorker />} />
              </Route>

              {/* Admin Layout and Admin Routes */}
              <Route path='/admin' element={<AdminLayout />}>
                <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
                <Route path='/admin/dashboard/orders' element={<AdminOrdersPage/>} />
              <Route path="/admin/dashboard/worker" element={<AdminWorkerManagement />} />
              <Route path="/admin/dashboard/worker/reviews" element={<ReviewsAdmin />} />
                <Route path="/admin/dashboard/client" element={<AdminUserManagement />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
}

export default App;