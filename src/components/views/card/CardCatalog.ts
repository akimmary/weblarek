import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { Card } from './Card';
import { IProduct } from '../../../types';
import { CDN_URL, categoryMap } from '../../../utils/constants';


export class CardCatalog extends Card<IProduct> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, protected events: IEvents, onClick: () => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', onClick);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.values(categoryMap).forEach(className => {
      this.categoryElement.classList.remove(className);
    });

    const className = categoryMap[value as keyof typeof categoryMap];
    if (className) {
      this.categoryElement.classList.add(className);
    }
  }

  set image(value: string) {
    this.imageElement.src = CDN_URL + value;
  }
}
