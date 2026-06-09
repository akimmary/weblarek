import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { Card } from './Card';
import { ICardBasket } from '../../../types';


export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    
    this.deleteButton.addEventListener('click', () => {
      this.events.emit('card:delete', { id: this.container.getAttribute('data-id') ?? '' })
    })
  }

    set index(value: number) {
    this.indexElement.textContent = String(value);
  }

    set data(value: ICardBasket) {
      this.title = value.title;
      this.price = value.price;
      this.index = value.index;
      this.container.setAttribute('data-id', value.id);
    }
}