import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasket } from '../../types';
import { IEvents } from '../base/Events';

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.orderButton.addEventListener('click', () => {
      this.events.emit('basket:checkout');
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set disabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}