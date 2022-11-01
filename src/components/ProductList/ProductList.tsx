import React, { FunctionComponent, useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import EditProduct from './EditProduct';
import { getProducts, saveProduct, deleteProduct } from '../../api/ProductApi/productApi';
import Product from '../../api/ProductApi/product';
import { ProductSortOrder } from '../../api/ProductApi/productSortOrder';
import { formatCurrency } from '../../common/utils/numbers'
import './productList.css';

const ProductList: FunctionComponent = () => {

    const [productData, setProductData] = useState<Product[]>([]);
    const [maxPagesCount, setMaxPagesCount] = useState<number>(0);
    const [activePage, setActivePage] = useState<number>(1);
    const [sortOrder, setSortOrder] = useState<ProductSortOrder>(ProductSortOrder.name);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [deleteProductId, setDeleteProductId] = useState<number>(0);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        loadData(1);
    }, []);

    const loadData = (pageNo: number, sortOrder: ProductSortOrder = ProductSortOrder.name) => {
        getProducts(pageNo, sortOrder).then(response => {
            if (response === undefined || response === null) {
                setProductData([]);
                setActivePage(1);
                setMaxPagesCount(0);
            } else {
                setProductData(response.products || []);
                setActivePage(response.activePage || 1);
                setMaxPagesCount(response.maxPages || 0);
            }
        });
        // Could add some error handling and messaging here.
    }

    const handleSortProducts = (sortOrder: ProductSortOrder) => {
        setSortOrder(sortOrder);
        loadData(1, sortOrder);
    }

    const handleChangePage = (pageNo: number) => {
        loadData(pageNo);
    }

    const handleAddProduct = () => {
        // The default selection is fruit.
        setEditingProduct({id: 0, name: '', price: 0.00, type: 'fruit', active: true});
    }

    const handleEditProduct = (product: Product) => {
        setEditingProduct({...product});
    }

    const handleSaveChanges = (product: Product) => {
        saveProduct(product).then(response => { 
            setEditingProduct(null);
            loadData(activePage, sortOrder);
        });
    }

    const handleCancelChanges = () => {
        setEditingProduct(null);
    }

    const handleDeleteDialogShow = (id: number) => { 
        setShowDeleteDialog(true); 
        setDeleteProductId(id);
    }
    const handleDeleteDialogClose = () => {
        setShowDeleteDialog(false);
        setDeleteProductId(0);
    }

    const handleDeleteProduct = () => {
        if (deleteProductId !== 0) {
            deleteProduct(deleteProductId).then(respone => { 
                setShowDeleteDialog(false);
                setDeleteProductId(0);
                loadData(activePage, sortOrder)
            }).catch(err => { 
                console.log(err)
            });
        }
    }

    const lookupProductName = (id: number) : string => {
        const product = productData.find(p => p.id === deleteProductId);
        if (product !== undefined) {
            return product.name;
        } else {
            return '';
        }
    }

    let pagingItems = [];
    for (let page = 1; page <= maxPagesCount; page++) {
        const pageNo = page;
        pagingItems.push(
            <Pagination.Item key={page} active={page === activePage} onClick={() => handleChangePage(pageNo)}>
            {page}
            </Pagination.Item>
        );
    }

    return (
        <div className='productListPage'>
            <h2>Retail Products</h2>
            {editingProduct !== null && 
                <EditProduct 
                    initialProduct={editingProduct}
                    onSaveChanges={handleSaveChanges}
                    onCancelChanges={handleCancelChanges}
                 />
            }
            {editingProduct === null && <React.Fragment>
                <div className='addProduct'>
                    <Button variant="success" onClick={() => handleAddProduct()}>Add Product</Button>
                </div>
                <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th onClick={() => handleSortProducts(ProductSortOrder.name)}>Name</th>
                    <th onClick={() => handleSortProducts(ProductSortOrder.price)}>Price</th>
                    <th onClick={() => handleSortProducts(ProductSortOrder.type)}>Type</th>
                    <th onClick={() => handleSortProducts(ProductSortOrder.active)}>Active</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {productData.map(product => (
                    <tr>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>{product.type}</td>
                        <td>{product.active ? "Yes" : "No"}</td>
                        <td className='tableRecordButtonWrapper'>
                            <Button variant="success" className='tableRecordButton' onClick={() => handleEditProduct(product)}>Edit</Button>
                            <Button variant="danger"  className='tableRecordButton'onClick={() => handleDeleteDialogShow(product.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <Pagination>{pagingItems}</Pagination>
        </React.Fragment>}

        <Modal show={showDeleteDialog} onHide={handleDeleteDialogClose}>
            <Modal.Header closeButton>
            <Modal.Title>Delete Product ({lookupProductName(deleteProductId)})</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete the product?</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteDialogClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleDeleteProduct}>
                Delete
            </Button>
            </Modal.Footer>
      </Modal>
      </div>
    )
}

export default ProductList;
