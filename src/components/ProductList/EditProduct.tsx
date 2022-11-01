import React, { FunctionComponent, useState } from 'react';
import Product from '../../api/ProductApi/product';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './editProduct.css';

interface EditProductProps {
    initialProduct: Product;
    onSaveChanges: (product: Product) => void;
    onCancelChanges: () => void;
}

const EditProduct: FunctionComponent<EditProductProps> = ({initialProduct, onSaveChanges, onCancelChanges}) => {

    const [product, setProduct] = useState<Product>(initialProduct);
    const [warningMessage, setWarningMessage] = useState<string>('');

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({...product, name: event.target.value});
    }

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({...product, price: parseFloat(parseFloat(event.target.value).toFixed(2))});
    }

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(event.target.value);
        debugger;
        setProduct({...product, type: event.target.value});
    }

    const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({...product, active: !product.active});
    }

    const validateData = () : string => {
        if (product.name.length === 0) {
            return 'Name must be entered';
        }
        if (product.price <= 0) {
            return 'A price must be greater than 0';
        }
        if (product.type === '') {
            return 'Type must be selected';
        }
        return ""
    }

    const handleSaveChanges = () => {
        const validationMessage = validateData();
        if (validationMessage.length > 0) {
            setWarningMessage(validationMessage);
        } else {
            onSaveChanges(product);
        }
    }

    const handleValidationDialogClose = () => {
        setWarningMessage('');
    }

    return (
        <div className='editProductPage'>
            <h2>{product.id === 0 ? 'Add Product' : 'Edit Product'}</h2>
            <br/>
            <label htmlFor='productName' className='productLabel'>Product Name:</label>
            <input
                id="productName"
                type="text"
                className='productInputElement'
                value={product.name}
                onChange={handleNameChange}
            />
            <label htmlFor='productPrice' className='productLabel'>Product Price:</label>
            <input
                id="productPrice"
                type="number"
                step=".01"
                className='productInputElement'
                placeholder='0.00'
                value={product.price}
                onChange={handlePriceChange}
            />
            <label htmlFor="productType" className='productLabel'>Product Type:</label>
            <select id="productType"
                className='productInputElement'
                onChange={handleTypeChange}>
                    <option value="fruit" selected={product.type==='fruit'}>Fruit</option>
                    <option value="vegetable" selected={product.type==='vegetable'}>Vegetable</option>
                    <option value="dairy" selected={product.type==='dairy'}>Dairy</option>
            </select>
            <br/>
            <div className="form-check">
                <label htmlFor='productActive' className="form-check-label">Active</label>
                <input
                    id="productActive" 
                    type="checkbox" 
                    className="form-check-input"
                    checked={product.active===true}
                    onChange={handleActiveChange}/>
            </div>
            <br/>
            <Button variant="primary" className='productButton' onClick={() => handleSaveChanges()}>Save</Button>
            <Button variant="secondary" className='productButton' onClick={() => onCancelChanges()}>Cancel</Button>

            <Modal show={warningMessage.length>0} onHide={handleValidationDialogClose}>
            <Modal.Header closeButton>
            <Modal.Title>Validation message</Modal.Title>
            </Modal.Header>
            <Modal.Body>{warningMessage}</Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleValidationDialogClose}>
                OK
            </Button>
            </Modal.Footer>
      </Modal>

        </div>
    )
}

export default EditProduct;
