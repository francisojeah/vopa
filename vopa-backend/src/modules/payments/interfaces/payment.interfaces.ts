

export interface PaymentProps {
  _id?: string;
  email: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  transactionId: string;
  createdAt: Date;
  toObject?: () => any;
}

