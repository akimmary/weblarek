import { IProduct } from '../../../types/index';

export class CatalogModel {
  _products: IProduct[];
  _selectedProduct: IProduct | null;

  constructor() {
    this._products = [];
    this._selectedProduct = null;
    } 

  setProducts(products: IProduct[]): void {
    this._products = products;
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProductById(id: string): IProduct | undefined {
    return this._products.find(product => product.id === id);
  }

  setSelectedProduct(product: IProduct | null): void {
    this._selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}
