import { IUser } from "./";
import { ISize } from "./products";


export interface IOrder {

    _id?: string;
    user?: IUser | string;
    orderItems: IOrderItem[];
    shippinAddress: ShippingAddress;
    paymentResult?: string;
    numberOfItems?: number;
    subTotal:       number;
    tax:            number;
    total:          number;

    isPaid:         boolean;
    paidAt:         string;

    transactionID?: string;

    createdAt?: string;
    updatedAt?: string;
}


export interface IOrderItem {
    _id:        string;
    title:      string;
    size:       ISize;
    quantity:   number;
    slug:       string;
    image:      string;
    gender:     string;
    price:      number;
}


export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}