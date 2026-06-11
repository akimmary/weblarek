import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events'; 
import { Form } from './Form';
import { IOrderForm } from '../../../types';

export class OrderForm extends Form<IOrderForm> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events );

    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order:input', { payment: 'card' });
    });
    
    this.cashButton.addEventListener('click', () => {
      this.events.emit('order:input', { payment: 'cash' });
    });

   this.addressInput.addEventListener('input', () => {
      this.events.emit('order:input', { address: this.addressInput.value });
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('order:submit');
      })
  }

  set payment(value: 'card' | 'cash') {
    this.cardButton.classList.remove('button_alt-active');
    this.cashButton.classList.remove('button_alt-active');
    
    if (value === 'card') {
      this.cardButton.classList.add('button_alt-active');
    } else if (value === 'cash') {
      this.cashButton.classList.add('button_alt-active');
    }
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}