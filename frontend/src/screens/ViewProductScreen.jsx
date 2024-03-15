/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import FormContainer from '../components/FormContainer';
import { useAxiosReadProduct, useLazyAxiosUpdateProduct } from "../api/product";

const ViewProductScreen = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState(false);
    const [productName, setProductName] = useState('');
    const [productCat, setProductCat] = useState('');
    const [productPrice, setProductPrice] = useState(0.0);
    const [supplier, setSupplier] = useState('');

    const [{ data: readProductResp },
        refetctReadProduct
    ] = useAxiosReadProduct(id);

    const [{ loading: createUpdateLoading }, updateProduct] =
        useLazyAxiosUpdateProduct(id);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                await refetctReadProduct();
            } catch (err) {
                console.log('Error - ', err.message);
            }
        };

        if (id) fetchData();
    }, [id]);

    useEffect(() => {
        if (readProductResp) {
            setProductName(readProductResp.productName);
            setProductCat(readProductResp.productCat);
            setProductPrice(readProductResp.productPrice);
            setSupplier(readProductResp.supplierId);
        }
    }, [readProductResp]);

    const handlePriceChange = (e) => {
        const inputPrice = e.target.value;

        // Check if input is a valid price format
        if (/^\d+(\.\d{0,2})?$/.test(inputPrice) || inputPrice === '') {
            setProductPrice(inputPrice);
        }
    };

    const toggleEditMode = () => {
        setIsEdit(!isEdit); // Toggle the value of isEdit
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await updateProduct(
                productName,
                productCat,
                productPrice,
                supplier
            );
            console.log('Done updated', data)
            navigate('/')
            
          } catch (err) {
            console.log('Error - ', err.message)
          }
    }
    return (
        <FormContainer>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <h1 style={{ marginRight: '10px', flex: '1' }}>Update Product Details</h1>
                <Button 
                    variant={isEdit ? 'danger' : 'primary'}
                    onClick={toggleEditMode} // Toggle edit mode when button is clicked
                    style={{ marginLeft: '10px' }}
                >
                    {isEdit ? <MdCancel/> : <FaEdit />}
                </Button>
            </div>
            <Form onSubmit={ submitHandler }>
                <Form.Group className='my-2' controlId='productName'>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter product name'
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        disabled={!isEdit}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='productCat'>
                    <Form.Label>Product Category</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter product category'
                        value={productCat}
                        onChange={(e) => setProductCat(e.target.value)}
                        disabled={!isEdit}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='supplier'>
                    <Form.Label>Supplier</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Select Supplier'
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        disabled={!isEdit}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='productPrice'>
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter product price'
                        value={productPrice}
                        onChange={handlePriceChange}
                        disabled={!isEdit}
                    ></Form.Control>
                </Form.Group>

                {isEdit && (<Button 
                    type='submit' 
                    variant='primary' 
                    className='mt-3'
                    disabled={createUpdateLoading}
                >
                    Update
                </Button>)}
            </Form>
        </FormContainer>
    )
}

export default ViewProductScreen