import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Form } from './Form';
import { IContactsForm } from '../../../types';

export class ContactsForm extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events)

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.container.addEventListener('input', () => {
      this.events.emit('contacts:input', {
        email: this.emailInput.value,
        phone: this.phoneInput.value
      });
    })

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('contacts:submit');
    })
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}