import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events'; 


export class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.events.emit('form:input', {field, value});
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('form:submit');
    });
  }

  protected setInputValue(name: keyof T, value: string) {
    const input = this.container.querySelector(`[name="${String(name)}"]`) as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }

  set valid(value: boolean) {
     this.submitButton.disabled = !value;
  }
  
  set errors(value: string) {
    this.errorElement.textContent = value
  }
}