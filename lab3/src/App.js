import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Apartment from './pages/Apartment';
import ApartmentDetails from './pages/ApartmentDetails';
import MyReservation from './pages/MyReservation';
import Contacts from './pages/Contacts';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import PrivateRoute from './components/Auth/PrivateRoute';

import './styles/Header.css';
import './styles/Footer.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/HomePage" element={<HomePage />} />
                        <Route path="/Apartment" element={<Apartment />} />
                        <Route path="/Apartment/:id" element={<ApartmentDetails />} />
                        <Route path="/MyReservation" element={
                            <PrivateRoute>
                                <MyReservation />
                            </PrivateRoute>
                        } />
                        <Route path="/Contacts" element={<Contacts />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;