import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { useLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/product');
        }
    }, [navigate, userInfo])

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({...res})); // Set userInfo state
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    };

    const popoverHoverFocus = (
        <Popover id="popover-trigger-hover-focus" title="Popover bottom">
          <strong>Admin</strong><br/>Email: cedi@email.com<br/>Password: 123456
          <br/><br/>
          <strong>Manager</strong><br/>Email: thomas@email.com<br/>Password: 123456
          <br/><br/>
          <strong>User</strong><br/>Email: jacob@email.com<br/>Password: 123456
        </Popover>
      );

    return (
        <FormContainer>
            <h1>Admin Sign In</h1>
            <Form onSubmit={ handleLogin }>
                <Form.Group className='my-2' controlId='username'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                { isLoading && <Loader/> }

                <div className="d-flex justify-content-between">
                    <Button type='submit' variant='primary' className='mt-3'>
                        Login
                    </Button>

                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="bottom"
                        overlay={popoverHoverFocus}
                    >
                        <Button className='mt-3'>Demo Credential</Button>
                    </OverlayTrigger>
                </div>
            </Form>
        </FormContainer>
    )
}

export default LoginScreen