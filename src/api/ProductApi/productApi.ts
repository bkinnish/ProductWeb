import { ProductSortOrder } from './productSortOrder';
import Product from './product';

export const getProducts = (pageNo: number, sortOrder: ProductSortOrder) => {

    // const init = { headers: [['Content-Type', 'application/json'], ['Accept', 'application/json']] };
    return fetch("https://localhost:44316/api/product", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }}).then(response => response.json());

    // TODO: Move code to unit tests.
    // if (pageNo === 1) {
    //     return Promise.resolve(
    //         {
    //             products: [{id: '1', name: "Apple", price: 2.20, type: "fruit", active: true},
    //                 {id: '2', name: "Orange", price: 1.50, type: "fruit", active: true},
    //                 {id: '3', name: "Pear", price: 1.75, type: "fruit", active: true},
    //                 {id: '4', name: "Banana", price: 1.90, type: "fruit", active: true},
    //                 {id: '5', name: "Pumpkin", price: 3.00, type: "vegetable", active: true}],
    //             activePage: 1,
    //             maxPages: 2
    //         });
    // } else {
    //     return Promise.resolve(
    //         {
    //             products: [
    //                 {id: '6', name: "Potatoe", price: 1.50, type: "vegetable", active: true},
    //                 {id: '7', name: "Carrot", price: 1.95, type: "vegetable", active: true}],
    //             activePage: 2,
    //             maxPages: 2
    //         });
    // }
}

export const saveProduct = (product: Product) => {
    if (product.id > 0) {
        return fetch(`https://localhost:44316/api/product/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        }).then(response => {
            if (response.status<200 && response.status>=300) {
                throw Error(`Issue saving product with id: ${product.id}`);
            }
            return;
        })
    } else {
        return fetch(`https://localhost:44316/api/product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(product)
        }).then(response => {
            if (response.status<200 && response.status>=300) {
                throw Error(`Issue adding product: ${product.name}`);
            }
            return;
        })
    }
}

export const deleteProduct = (id: number) => {
    return fetch(`https://localhost:44316/api/product/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }}).then(response => {
            if (response.status<200 && response.status>=300) {
                throw Error(`Issue deleting product with id: ${id}`);
            }
            return;
        });
}
