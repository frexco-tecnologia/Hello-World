import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsPositive } from 'class-validator';

export class Coordinates {
    @ApiProperty({ type: Number, example: -33.8569175 })
    @IsDefined()
    public lat: number;

    @ApiProperty({ type: Number, example: 151.2132903 })
    @IsDefined()
    public lng: number;
}

export class Area {
    @ApiProperty({ type: String, example: '487' })
    public id?: string;

    @ApiProperty({ type: String, example: 'Sao Paulo' })
    public name: string;

    @ApiProperty({ type: Number, example: 14.35 })
    public individualDeliveryFee: number;

    @ApiProperty({ type: Number, example: 35.35 })
    public businessDeliveryFee: number;

    @ApiProperty({ type: [Coordinates] })
    public polygon: Coordinates[];
}
