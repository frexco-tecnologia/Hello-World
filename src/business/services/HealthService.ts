import { Injectable } from "@nestjs/common";
import { AreaModel } from "../repositories/models/AreaModel";


@Injectable()
export class HealthService {
    
    public get databaseIsHealth(): Promise<boolean> {
        return AreaModel.knex().raw('select 1')
            .then(x => true)
            .catch(() => false);
    }
    
    public get isHealth(): Promise<boolean> {
        const promises = [this.databaseIsHealth];

        return Promise.all(promises)
            .then(lst => lst.every(x => x))
            .catch(() => false)
    }
}