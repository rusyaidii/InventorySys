import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { useUpdateUserMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
        setRole(userInfo.role);
    }, [userInfo.setName, userInfo.setEmail]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await updateUser({
                _id: userInfo._id,
                name,
                email,
                password
            }).unwrap();
            dispatch(setCredentials({...res})); // Set userInfo state
            toast.success('Profile updated!')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    };

    return (
        <FormContainer>
            <h1>Update Profile</h1>
            <Form onSubmit={ handleUpdate }>
                <Form.Group className='my-2' controlId='username'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='my-2' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='role'>
                    <Form.Label>User Role</Form.Label>
                    <Form.Control
                        type='text'
                        value={role}
                        disabled={true}
                        //onChange={(e) => setEmail(e.target.value)}
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

                <Button type='submit' variant='primary' className='mt-3'>
                    Update
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ProfileScreen