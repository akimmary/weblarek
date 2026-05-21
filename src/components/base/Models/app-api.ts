import { IApi, IProduct, TOrderData, TOrderResult } from '../../../types/index';

export class AppApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api.get<IProduct[]>('/product');
  }

  postOrder(orderData: TOrderData): Promise<TOrderResult> {
    return this.api.post<TOrderResult>('/order', orderData);
  }
}