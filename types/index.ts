export type UsersType = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "admin" | "manager" | "delivery_man";
  NID: string;
  avatar?: string | undefined;
};

export type CustomersType = {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  secondaryPhone?: string;
  role: "customer";
  address: string;
};

export type OrdersType = {
  _id: string;
  customer: string;
  name: string;
  phone: string;
  secondaryPhone?: string;
  address: string;
  addedBy: string;
  addedByRole: "manager" | "admin";
  quantity: number;
  price: number;
  date: Date;
};
