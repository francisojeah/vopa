import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { Payment, PaymentSchema } from './schemas/payment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
