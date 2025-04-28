import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import '../styles/Header.css';

function Header() {
    const { currentUser, logout } = useAuth();

    return (
        <header className="header">
            <div className="container">
                <div className="header_inner">
                    <div className="header_logo">
                        <Link to="/">
                            <img src="/images/logo/Untitled_logo_1_free-file-Photoroom.png" alt="RuMa Logo"/>
                        </Link>
                    </div>
                    <nav className="nav">
                        <Link className="nav_item" to="/HomePage">Головна</Link>
                        <Link className="nav_item" to="/Apartment">Доступні квартири</Link>
                        <Link className="nav_item" to="/MyReservation">Мої бронювання</Link>
                        <Link className="nav_item" to="/Contacts">Контакти</Link>
                        {currentUser ? (
                            <button className="nav_item" onClick={logout} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                                Вийти
                            </button>
                        ) : (
                            <Link className="nav_item" to="/login">Увійти</Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;