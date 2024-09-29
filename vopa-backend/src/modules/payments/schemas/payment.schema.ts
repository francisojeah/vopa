import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';
import { PaymentProps } from '../interfaces/payment.interfaces';

export type PaymentDocument = HydratedDocument<PaymentProps>;


@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  method: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.plugin(customTimestampPlugin);
