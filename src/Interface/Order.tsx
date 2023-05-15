import { OrderProduct } from "./OrderProduct";

export interface Order {
  id: number | undefined;
  orderCode: string | undefined;
  customer: string | undefined;
  contactPerson: string | undefined;
  contactPersonPhone: string | undefined;
  gst: string | undefined;
  builtNumber: string | undefined;
  address: string | undefined;
  city: string | undefined;
  state: string | undefined;
  zipCode: string | undefined;
  otherDetails: string | undefined;
  orderDueDate: string| undefined;
  orderStatus: string | undefined;
  amount: string | undefined;
  amountReceived: string | undefined;
  isActive: boolean; 
  createDate: string | undefined;
  createOrUpdateBy: string | undefined;
  updateDate: string | undefined;
  products: OrderProduct[];
}
