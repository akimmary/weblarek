import { IBuyer, TPayment, TValidationErrors } from '../../types/index';
import { IEvents } from '../base/Events'; 

export class BuyerModel {
  protected  data: IBuyer;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.data = {
      payment: '',
      email: '',
      phone: '',
      address: ''
    };
    this.events = events;

  }

  setPayment(payment: TPayment): void {
    this.data.payment = payment;
    this.events.emit('buyer:changed');
  }

  setEmail(email: string): void {
    this.data.email = email;
    this.events.emit('buyer:changed');
  }

  setPhone(phone: string): void {
    this.data.phone = phone;
    this.events.emit('buyer:changed');
  }

  setAddress(address: string): void {
    this.data.address = address;
    this.events.emit('buyer:changed');
  }

  getAllData(): IBuyer {
    return { ...this.data };
  }

  clear(): void {
      this.data = {
    payment: '',
    email: '',
    phone: '',
    address: ''
  }
  this.events.emit('buyer:changed');
}

  validate(): TValidationErrors {
    const errors: TValidationErrors = {};
    
    if (!this.data.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.data.email) {
      errors.email = 'Укажите email';
    }
    if (!this.data.phone) {
      errors.phone = 'Укажите телефон';
    }
    if (!this.data.address) {
      errors.address = 'Укажите адрес';
    }
    return errors;
  }
}
