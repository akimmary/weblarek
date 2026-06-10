import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { Card } from './Card';
import { ICardPreview } from '../../../types';


export class CardPreview extends Card<ICardPreview> {
  protected descriptionElement: HTMLElement;
  protected addButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.addButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.addButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = this.container.getAttribute('data-id') ?? '';
      const isInCart = this.addButton.textContent === 'Удалить из корзины';

      if (isInCart) {
        this.events.emit('card:remove', { id });
      } else {
        this.events.emit('card:add', { id });
      }
    });
  }
  
  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inCart(value: boolean) {
    if (value) {
      this.addButton.textContent = 'Удалить из корзины';
      this.addButton.disabled = false;
    } else {
      this.addButton.textContent = 'В корзину';
      this.addButton.disabled = false;
    }
  }

  set data(value: ICardPreview) {
    this.title = value.title;
    this.price = value.price;
    this.category = value.category;
    this.image = value.image;
    this.description = value.description;
    this.container.setAttribute('data-id', value.id);
     
    if (value.price === null) {
      this.addButton.disabled = true;
      this.addButton.textContent = 'Недоступно';
    }
    if (value.inCart) {
      this.inCart = value.inCart;
    }
  }
}

