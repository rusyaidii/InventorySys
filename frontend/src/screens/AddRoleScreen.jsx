
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';

import FormContainer from '../components/FormContainer';
import { useLazyAxiosCreateRole } from "../api/role";

const AddRoleScreen = () => {
    const [name, setName] = useState('');
    const [permission, setPermission] = useState([])

    const [{ loading: createRoleLoading }, createRole] =
        useLazyAxiosCreateRole();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prepare the role object with name and permissions
        const role = {
            name: name,
            permissions: permission
        };
        
        try {
            await createRole(role);
            toast.success('New Role Created!');
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    };

    const handlePermissionChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            // Add permission to the state if checked
            setPermission(prevPermissions => [...prevPermissions, value]);
        } else {
            // Remove permission from the state if unchecked
            setPermission(prevPermissions => prevPermissions.filter(permission => permission !== value));
        }
    };

  return (
    <FormContainer>
            <h1>Add New Role</h1>
            <Form onSubmit={ handleSubmit }>
                <Form.Group className='my-2' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter role name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='permission'>
                    <Form.Label>Permission</Form.Label>
                    <Form.Check
                        type='checkbox'
                        label='read'
                        value='read'
                        onChange={handlePermissionChange}
                    />
                    <Form.Check
                        type='checkbox'
                        label='create'
                        value='create'
                        onChange={handlePermissionChange}
                    />
                    <Form.Check
                        type='checkbox'
                        label='update'
                        value='update'
                        onChange={handlePermissionChange}
                    />
                    <Form.Check
                        type='checkbox'
                        label='delete'
                        value='delete'
                        onChange={handlePermissionChange}
                    />
                </Form.Group>

                <Button type='submit' variant='primary' className='mt-3' disabled={createRoleLoading}>
                    Add
                </Button>
            </Form>
        </FormContainer>
  )
}

export default AddRoleScreen