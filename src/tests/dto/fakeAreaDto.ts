import { AreaDto } from "../../business/types/dto/AreaDto";

export const fakeAreaDto: AreaDto = {
    name: 'Osasco',
    deliveryFee: {
        individual: 13.11,
        business: 55.31,
    },
    polygon: [
        { lat: -12.9953688, lng: -38.4671757 },
        { lat: -12.9824678, lng: -38.4607487 },
        { lat: -12.9814428, lng: -38.4762087 },
        { lat: -12.9897648, lng: -38.4867337 },
    ],
}
