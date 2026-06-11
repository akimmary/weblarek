import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class CartModel {
  protected items: IProduct[];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.events = events;
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  addProduct(product: IProduct): void {
    if (!this.containsProduct(product.id)) {
      this.items.push(product);
      this.events.emit('cart:changed');
    }
  }

  removeProduct(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.events.emit('cart:changed');
    }
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed');
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