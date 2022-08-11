import { Area, Coordinates } from '../types/Area';
import { Repository } from '../repositories/Repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AreaApp {
    constructor(private repo: Repository, private logger: Logger) {
    }

    public list = (): Promise<Area[]> => {
        this.logger.debug('Area App » All areas will be listed.');

        return this.repo.list();
    };
}
