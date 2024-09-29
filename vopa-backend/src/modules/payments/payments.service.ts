import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentProps } from './interfaces/payment.interfaces';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel('Payment') private readonly paymentModel: Model<Payment>) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentProps> {
    const newPayment = new this.paymentModel(createPaymentDto);
    return newPayment.save();
  }

  async findAll(): Promise<PaymentProps[]> {
    return this.paymentModel.find().exec();
  }
}
