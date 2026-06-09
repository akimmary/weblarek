import { IApi, TProductsResponse, TOrderData, TOrderResult } from '../../types/index';
import { IProduct } from '../../types/index';

export class AppApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api.get<TProductsResponse>('/product').then(res => res.items);
  }

  postOrder(orderData: TOrderData): Promise<TOrderResult> {
    return this.api.post<TOrderResult>('/order', orderData);
  }
}