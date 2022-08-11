import { ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../Area";
import { DeliveryFee } from "../DeliveryFee";

export class AreaViewModel {
    @ApiProperty({ type: String, example: '536' })
    id?: string;

    @ApiProperty({ type: String, example: 'Olaria' })
    name: string;

    @ApiProperty({ type: DeliveryFee, example: { individual: 17.25, business: 85.11 }})
    deliveryFee: DeliveryFee;

    @ApiProperty({ type: [Coordinates], example: { lat: -35.005050505, lng: 25.222556225 }})
    polygon: Coordinates[];
}
