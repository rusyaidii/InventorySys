import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { IoMdArrowRoundBack } from "react-icons/io";

import { useLazyAxiosCreateProduct } from "../api/product";

const CreateProductScreen = () => {
    const navigate = useNavigate();
    const [productName, setProductName] = useState('');
    const [productCat, setProductCat] = useState('');
    const [productPrice, setProductPrice] = useState(0.0);
    const [supplier, setSupplier] = useState('');

    const [{ loading: createProductLoading }, createProduct] =
        useLazyAxiosCreateProduct();

    const handlePriceChange = (e) => {
        const inputPrice = e.target.value;
        
        // Check if input is a valid price format
        if (/^\d+(\.\d{0,2})?$/.test(inputPrice) || inputPrice === '') {
            setProductPrice(inputPrice);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await createProduct(
                productName,
                productCat,
                productPrice,
                supplier
            );
            console.log('Done create', data)
            navigate('/')
            
          } catch (err) {
            console.log('Error - ', err.message)
          }
    }
    return (
        <>
        <Button
          variant={"primary"}
          onClick={(e) => navigate('/product')} // Toggle edit mode when button is clicked
          style={{ marginTop: "10px" }}
        >
            <IoMdArrowRoundBack/>
        </Button>
        <FormContainer>
            <h1>Add New Product</h1>
            <Form onSubmit={ submitHandler }>
                <Form.Group className='my-2' controlId='productName'>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter product name'
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='productCat'>
                    <Form.Label>Product Category</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter product category'
                        value={productCat}
                        onChange={(e) => setProductCat(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='supplier'>
                    <Form.Label>Supplier</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Select Supplier'
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='productPrice'>
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter product price'
                        value={productPrice}
                        onChange={handlePriceChange}
                    ></Form.Control>
                </Form.Group>

                <Button 
                    type='submit' 
                    variant='primary' 
                    className='mt-3'
                    disabled={createProductLoading}
                >
                    Add
                </Button>
            </Form>
        </FormContainer>
    </>
    )
}

export default CreateProductScreen