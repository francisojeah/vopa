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
import { KoraWebhookDto } from './dto/kora-webhook.dto';

@Injectable()
export class PaymentService {
  private readonly koraApiUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly httpService: HttpService,
    private configService: ConfigService,
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
    const apiUrl = 'https://api.kora.com/v1/payments';
    const payload = {
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency,
      paymentMethod: createPaymentDto.paymentMethod,
      transactionId,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(apiUrl, payload),
      );
      return response?.data;
    } catch (error) {
      throw new InternalServerErrorException('Error initiating payment');
    }
  }

  // Update payment status (e.g., after callback from payment provider)
  async updatePaymentStatus(koraWebhookDto: KoraWebhookDto): Promise<Payment> {
    const { transactionId, status } = koraWebhookDto;

    const payment = await this.paymentModel.findOne({ transactionId });
    if (!payment) {
      throw new NotFoundException(
        `Payment with transaction ID ${transactionId} not found`,
      );
    }

    payment.status = status; // Update status based on webhook
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
}
