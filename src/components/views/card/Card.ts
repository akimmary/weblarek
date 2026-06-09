import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import {  IProduct } from '../../../types';
import { CDN_URL, categoryMap  } from '../../../utils/constants';

export class Card<T extends IProduct> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected categoryElement?: HTMLElement;
  protected imageElement?: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = 'Бесценно';
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;
      
      Object.values(categoryMap).forEach(className => {
        this.categoryElement?.classList.remove(className);
      });
      
      const className = categoryMap[value as keyof typeof categoryMap];
      if (className) {
        this.categoryElement.classList.add(className);
      }
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.imageElement.src = CDN_URL + value;
    }
  }
}