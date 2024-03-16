/* eslint-disable react-hooks/exhaustive-deps */
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';

import { useLazyAxiosProductPopulate } from '../api/product';
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [, populateProduct] = useLazyAxiosProductPopulate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            window.location.reload();
            navigate('/');
        } catch (err) {
            console.log(err)
        }
    }

    const handlePopulate = async () => {
        try {
          const resp = await populateProduct();
          toast.success(resp)
        } catch (err) {
          toast.error("Error - ", err.message);
        } finally {
          window.location.reload();
        }
      };

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <Navbar.Brand href='/'>InventorySys</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        { userInfo?.role === 'admin' && (
                            <Nav className='me-auto'>
                                <NavDropdown title='Role Settings'>
                                    <LinkContainer to='/new-role'>
                                        <NavDropdown.Item>
                                            Add New Role
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/roles'>
                                        <NavDropdown.Item>
                                            Role List
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                                <Nav.Link onClick={handlePopulate}>
                                    Populate Product
                                </Nav.Link>
                            </Nav>
                        ) }
                        <Nav className='ms-auto'>
                            {userInfo ? (
                                <>
                                    <NavDropdown title={userInfo.name} id='username'>
                                        <LinkContainer to='/profile'>
                                            <NavDropdown.Item>
                                                Profile
                                            </NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={ logoutHandler }>
                                            <FaSignInAlt /> Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                <Nav.Link href='./admin'>
                                    <FaSignInAlt /> Admin
                                </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
