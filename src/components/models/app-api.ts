import { IApi, TProductsResponse, TOrderData, TOrderResult } from '../../types/index';

export class AppApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<TProductsResponse> {
    return this.api.get<TProductsResponse>('/product');
  }

  postOrder(orderData: TOrderData): Promise<TOrderResult> {
    return this.api.post<TOrderResult>('/order', orderData);
  }
}