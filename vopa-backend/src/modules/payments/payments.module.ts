import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { Payment, PaymentSchema } from './schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    HttpModule, 
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
