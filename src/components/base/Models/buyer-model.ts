import { IBuyer, TPayment } from '../../../types/index';

export class BuyerModel {
  _data: IBuyer;

  constructor() {
    this._data = {
      payment: '',
      email: '',
      phone: '',
      address: ''
    };
  }

  setPayment(payment: TPayment): void {
    this._data.payment = payment;
  }

  setEmail(email: string): void {
    this._data.email = email;
  }

  setPhone(phone: string): void {
    this._data.phone = phone;
  }

  setAddress(address: string): void {
    this._data.address = address;
  }

  getAllData(): IBuyer {
    return { ...this._data };
  }

  clear(): void {
      this._data = {
    payment: '',
    email: '',
    phone: '',
    address: ''
  }
}

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    
    if (!this._data.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this._data.email) {
      errors.email = 'Укажите email';
    }
    if (!this._data.phone) {
      errors.phone = 'Укажите телефон';
    }
    if (!this._data.address) {
      errors.address = 'Укажите адрес';
    }
    return errors;
  }
}
