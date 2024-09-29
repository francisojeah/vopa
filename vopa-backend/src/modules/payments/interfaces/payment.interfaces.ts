

export interface PaymentProps {
  _id?: string;
  email: string;
  amount: number;
  method: string;
  toObject?: () => any;
}

