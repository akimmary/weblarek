import { IBuyer, TPayment, TValidationErrors } from '../../types/index';

export class BuyerModel {
  protected  data: IBuyer;

  constructor() {
    this.data = {
      payment: '',
      email: '',
      phone: '',
      address: ''
    };
  }

  setPayment(payment: TPayment): void {
    this.data.payment = payment;
  }

  setEmail(email: string): void {
    this.data.email = email;
  }

  setPhone(phone: string): void {
    this.data.phone = phone;
  }

  setAddress(address: string): void {
    this.data.address = address;
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
