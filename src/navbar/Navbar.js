import {React, useState }  from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    //Activacion de la opcion del navbar al dar click
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname === '/' ? 'Clientes' : 'Facturas');

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <FontAwesomeIcon icon={faFileInvoice} className="logo-icon" />
                <span className="logo-text">FACTURATE</span>
            </div>
            <div className="menu">
                <Link
                    to="/"
                    className={`menu-item ${activeItem === 'Clientes' ? 'active' : ''}`}
                    onClick={() => handleItemClick('Clientes')}
                >
                    Clientes
                </Link>
                <Link
                    to="/invoice"
                    className={`menu-item ${activeItem === 'Facturas' ? 'active' : ''}`}
                    onClick={() => handleItemClick('Facturas')}
                >
                    Facturas
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
