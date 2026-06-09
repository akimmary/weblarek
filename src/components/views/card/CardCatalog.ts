import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { Card } from './Card';
import { IProduct } from '../../../types';


export class CardCatalog extends Card<IProduct> {

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.container.getAttribute('data-id') ?? '' })
    })
  }

  set data(value: IProduct) {
    this.title = value.title;
    this.price = value.price;
    this.category = value.category;
    this.image = value.image;
    this.container.setAttribute('data-id', value.id);
  }
}
