import { AreaViewModel } from "../../business/types/view-models/AreaViewModel";

export const fakeAreaViewlModel: AreaViewModel = {
    id: '326',
    name: 'Brumadinho',
    deliveryFee: {
        individual: 25.22,
        business: 11.14
    },
    polygon: [
        { lat: -11.9953688, lng: 49.4671757 },
        { lat: -11.9824678, lng: 25.4607487 },
        { lat: -11.9814428, lng: 49.4762087 },
        { lat: -11.9897648, lng: 25.4867337 }
    ]
}
