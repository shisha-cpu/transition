    import React from 'react';
    import { Link } from 'react-router-dom';
    import './Header.css'; 
    import { useDispatch, useSelector } from 'react-redux';

    export default function Header() {
        const isLoggedIn = useSelector(state => state.isLoggin)
        return (
            <header className="header-container">
                <Link to='/' className="header-link logo">
                    <div className="logo-text">Finance.com</div>
                </Link>
                <nav className="nav-links">
                    <Link to='/about' className="header-link">Как управлять финансами </Link>

                    {!isLoggedIn.isLoggin ? (
                        <>
                            <Link to='/register' className="header-link">Регистрация</Link>
                            <Link to='/login' className="header-link">Вход</Link>
                        </>
                    ) : (
                        <Link to='/dashboard' className="header-link">Мои финансы </Link>
                    )}
                </nav>
            </header>
        );
    }
