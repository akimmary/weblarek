import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { Card } from './Card';
import { ICardPreview } from '../../../types';
import { CDN_URL, categoryMap  } from '../../../utils/constants';

export class CardPreview extends Card<ICardPreview> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected addButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents, onAction: () => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.addButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.addButton.addEventListener('click', (event) => {
      event.stopPropagation();
      onAction();
    });
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.addButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.addButton.disabled = value;
  }
}

