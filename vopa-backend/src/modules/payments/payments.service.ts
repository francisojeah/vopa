import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { v4 as uuidv4 } from 'uuid';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private readonly koraApiUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.koraApiUrl = this.configService.get<string>('KORA_API_URL');
    this.apiKey = this.configService.get<string>('KORA_API_KEY');
  }

  // Create a new payment
  async createPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    const transactionId = uuidv4();
    const newPayment = new this.paymentModel({
      ...createPaymentDto,
      transactionId,
      status: 'pending',
    });

    const savedPayment = await newPayment.save();

    // Call Kora's API to initiate payment
    const apiUrl = `${this.koraApiUrl}/v1/payments`;
    const payload = {
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency,
      paymentMethod: createPaymentDto.paymentMethod,
      transactionId,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(apiUrl, payload, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      // Update the payment status based on Kora's response
      savedPayment.status = 'completed';
      await savedPayment.save();
      return response.data;
    } catch (error) {
      console.error('Error initiating payment:', error.response?.data || error);
      throw new InternalServerErrorException('Error initiating payment');
    }
  }

  async updatePaymentStatus(
    transactionId: string,
    status: string,
  ): Promise<Payment> {
    const payment = await this.paymentModel.findOne({ transactionId });

    if (!payment) {
      throw new NotFoundException(
        `Payment with transaction ID ${transactionId} not found`,
      );
    }

    payment.status = status;
    return payment.save();
  }

  // Find payment by transaction ID
  async findPaymentByTransactionId(transactionId: string): Promise<Payment> {
    const payment = await this.paymentModel.findOne({ transactionId });
    if (!payment) {
      throw new NotFoundException(
        `Payment with transaction ID ${transactionId} not found`,
      );
    }
    return payment;
  }

  // List all payments by user
  async getUserPayments(userId: string): Promise<Payment[]> {
    return this.paymentModel.find({ userId });
  }

  // Get payment status from Kora's API
  async getPaymentStatus(transactionId: string): Promise<any> {
    const apiUrl = `${this.koraApiUrl}/v1/payments/${transactionId}`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching payment status:', error.response?.data || error);
      throw new InternalServerErrorException('Error fetching payment status');
    }
  }
}
