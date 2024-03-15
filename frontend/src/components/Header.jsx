/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isAdmin') === 'true');
    const location = useLocation();

    useEffect(() => {
        const storedRole = localStorage.getItem('isAdmin');
        if (storedRole === 'true') {
          setIsLoggedIn(true);
        }
      }, [localStorage.getItem('isAdmin')]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        setIsLoggedIn(false);
        window.location.reload();
    };

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <Navbar.Brand href='/'>InventorySys</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            {(!isLoggedIn && location.pathname !== '/admin') && (
                                <Nav.Link href='./admin'>
                                    <FaSignInAlt /> Admin
                                </Nav.Link>
                            )}
                            {isLoggedIn && (
                                <Button onClick={handleLogout}>
                                    <FaSignInAlt /> Logout
                                </Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
