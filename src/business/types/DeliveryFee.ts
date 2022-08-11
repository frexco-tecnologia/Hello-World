import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class DeliveryFee {
    @ApiProperty({ type: Number, example: 14.75 })
    @IsPositive()
    individual: number;

    @ApiProperty({ type: Number, example: 17.33 })
    @IsPositive()
    business: number;
}
