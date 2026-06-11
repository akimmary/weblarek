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

  }
  
  set valid(value: boolean) {
     this.submitButton.disabled = !value;
  }
  
  set errors(value: string) {
    this.errorElement.textContent = value
  }
}