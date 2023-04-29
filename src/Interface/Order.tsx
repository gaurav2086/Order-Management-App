export interface Order {
  id: number | undefined;
  orderCode: string | undefined;
  customer: string | undefined;
  address: string | undefined;
  details: string | undefined;
  contactPersonName: string | undefined;
  contactPersonPhone: string | undefined;
  orderStatus: string | undefined;
  isActive: boolean;
  amount: string | undefined;
  tentativeDate: string | undefined;
  createdBy: string | undefined;
}
