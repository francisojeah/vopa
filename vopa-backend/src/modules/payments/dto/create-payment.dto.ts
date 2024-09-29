import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  email: string; // Reference to User

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  method: string; // e.g., "card", "bank_transfer", etc.
}
