import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        // For demo purposes, let's assume the correct username and password are 'admin'
        if (username === 'admin' && password === 'admin') {
          localStorage.setItem('isAdmin', true);
          navigate('/');
        } else {
          alert('Invalid username or password');
        }
    };

    return (
        <FormContainer>
            <h1>Admin Sign In</h1>
            <Form onSubmit={ handleLogin }>
                <Form.Group className='my-2' controlId='username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

                <Button type='submit' variant='primary' className='mt-3'>
                    Login
                </Button>
            </Form>
        </FormContainer>
    )
}

export default LoginScreen