import { IProduct } from '../../../types/index';

export class CartModel {
  _items: IProduct[];

  constructor() {
    this._items = [];
  }

  getItems(): IProduct[] {
    return this._items;
  }

  addProduct(product: IProduct): void {
    this._items.push(product);
  }

  removeProduct(product: IProduct): void {
    const index = this._items.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  clear(): void {
    this._items = [];
  }

  getTotalPrice(): number {
    return this._items.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  getTotalCount(): number {
    return this._items.length;
  }

  containsProduct(id: string): boolean {
    return this._items.some(item => item.id === id)
  }
}