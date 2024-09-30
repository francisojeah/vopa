import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  readonly currency: string;

  @IsNotEmpty()
  @IsString()
  readonly paymentMethod: string;
}