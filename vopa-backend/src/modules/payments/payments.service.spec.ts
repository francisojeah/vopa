import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payments.service';
import { PaymentModule } from './payments.module';
import { getModelToken } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';
import { HttpService } from '@nestjs/axios';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PaymentModule],
      providers: [
        PaymentService,
        {
          provide: getModelToken(Payment.name),
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
