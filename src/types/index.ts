export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;          
    description: string;  
    image: string;       
    title: string;       
    category: string;    
    price: number | null
}

export type TPayment = 'card' | 'cash' | ''; 

export interface IBuyer {
  payment: TPayment;
  email: string;                 
  phone: string;                 
  address: string;               
}

export type TProductsResponse = {
  total: number;
  items: IProduct[];
}

export type TOrderData = IBuyer & {
  total: number;
  items: IProduct['id'][];
}

export type TOrderResult = {
  id: string;
  total: number;
}

export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IHeader {
  counter: number;
}

export interface  IGallery {
  catalog: HTMLElement[];
}

export interface IModal {
  content: HTMLElement;
}

export interface ISuccess {
  total: number;
}

export interface ICardPreview extends IProduct {
  inCart?: boolean;
}

export interface ICardBasket extends IProduct {
  index: number;
}

export interface IBasket {
  items: HTMLElement[];
  total: number;
}

export interface IOrderForm {
  payment: 'card' | 'cash' | '';
  address: string;
}

export interface IContactsForm {
  email: string;
  phone: string;
}