import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { KoraWebhookDto } from './dto/kora-webhook.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Create a payment (initiate payment process)
  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.createPayment(createPaymentDto);
  }

  // Get payment by transaction ID
  @Get(':transactionId')
  async getPayment(@Param('transactionId') transactionId: string) {
    return await this.paymentService.findPaymentByTransactionId(transactionId);
  }

  // Update payment status (called by webhook or manual update)
  @Patch(':transactionId/status')
  async updatePaymentStatus(
    @Param('transactionId') transactionId: string,
    @Body('status') status: string,
  ) {
    return await this.paymentService.updatePaymentStatus(transactionId, status);
  }

  // Get all payments for a specific user
  @Get('user/:userId')
  async getUserPayments(@Param('userId') userId: string) {
    return await this.paymentService.getUserPayments(userId);
  }

  // Handle Kora webhook
  @Post('webhook')
  async handleKoraWebhook(@Body() koraWebhookDto: KoraWebhookDto) {
    return this.paymentService.updatePaymentStatus(koraWebhookDto);
  }
}
