import { ApiProperty } from '@nestjs/swagger';
import { Coordinates } from '../Area';
import { DeliveryFee } from '../DeliveryFee';
import { IsDefined, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AreaDto {
    @ApiProperty({ type: String, example: 'Oscar' })
    @IsDefined()
    public name: string;

    @ApiProperty({ type: DeliveryFee, example: { individual: 14.73, business: 33.12 } })
    @Type(() => DeliveryFee)
    @ValidateNested()
    public deliveryFee: DeliveryFee;

    @ApiProperty({ type: [Coordinates], example: { lat: -15.33226233, lng: 14.225636312 } })
    @Type(() => Coordinates)
    @ValidateNested()
    @MinLength(3)
    public polygon: Coordinates[];
}
