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