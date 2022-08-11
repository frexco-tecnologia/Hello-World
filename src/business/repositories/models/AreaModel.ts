import { Model } from 'objection';
import { Coordinates } from '../../types/Area';

export class AreaModel extends Model {
    public static tableName = 'area';

    public id?: string;
    public name: string;
    public individualDeliveryFee: number;
    public businessDeliveryFee: number;
    public polygon: Coordinates[];
}
