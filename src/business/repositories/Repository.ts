import { Area, Coordinates } from '../types/Area';
import { AreaModel } from './models/AreaModel';
import * as knexPostgis from 'knex-postgis';
import * as Knex from 'knex';
import { KnexPostgis} from 'knex-postgis';

const SRID = 4326;

export class Repository {

    private get st(): KnexPostgis {
        return knexPostgis(AreaModel.knex());
    }

    public list = (): Promise<Area[]> =>
        AreaModel.knex()
            .column('*', this.st.asText('polygon'))
            .select()
            .from(AreaModel.tableName)
            .then(this.mapListResult);

    private mapListResult = (result: any[]): Area[] =>
        result.map(this.mapResult);

    private mapResult = (result: any): Area => ({
        ...result,
        polygon: this.getPolygon(result.polygon),
    } as Area);

    private getPolygon = (dbCell: string): Coordinates[] =>
        dbCell
            .replace('POLYGON((', '')
            .replace('))', '')
            .split(',')
            .map(x => x.split(' '))
            .map(arr => arr.map(z => Number(z)))
            .map(([lat, lng]) => ({ lat, lng }));
}