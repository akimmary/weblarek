import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events'; 

export class CatalogModel {
  protected products: IProduct[];
  protected selectedProduct: IProduct | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.products = [];
    this.selectedProduct = null;
    this.events = events;
    } 

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed', this.products);
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
    this.events.emit('catalog:selected', product ?? undefined);
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
