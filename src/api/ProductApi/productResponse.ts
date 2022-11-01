import Product from './product';

export default interface ProductResponse {
    products: Product[],
    activePage: number,
    maxPages: number
}
