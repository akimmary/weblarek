import { IProduct } from '../../types/index';

export class CartModel {
  protected items: IProduct[];

  constructor() {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    this.items.push(product);
  }

  removeProduct(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  getTotalCount(): number {
    return this.items.length;
  }

  containsProduct(id: string): boolean {
    return this.items.some(item => item.id === id)
  }
}