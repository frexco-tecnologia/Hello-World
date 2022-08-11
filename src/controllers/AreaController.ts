import { BadRequestException, Body, Controller, Get, Logger, Param, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequired } from 'ameixa-shared/AuthRequiredMiddleware';
import { RolesEnum } from 'ameixa-shared/CurrentUser';
import { AreaApp } from '../business/apps/AreaApp';
import { Area } from '../business/types/Area';
import { AreaDto } from '../business/types/dto/AreaDto';
import { AreaViewModel } from '../business/types/view-models/AreaViewModel';

@Controller('area')
@ApiTags('Areas')
export class AreaController {
    constructor(private app: AreaApp, private logger: Logger) {
    }

    @Get()
    @AuthRequired(RolesEnum.admin, RolesEnum.operator)
    @ApiResponse({ status: 200, type: [AreaViewModel] })
    public list(): Promise<AreaViewModel[]> {
        this.logger.debug('Area Controller » List of areas will be requested.');

        return this.app.list().then(lst => lst.map(this.mapToViewModel));
    }

    private mapToViewModel = (area: Area): AreaViewModel => {
        this.logger.debug('Area Controller » Area will be mapped to view model.');
        this.logger.debug(area);

        if (!area) return;

        return {
            id: area.id,
            name: area.name,
            deliveryFee: { individual: area.individualDeliveryFee, business: area.businessDeliveryFee },
            polygon: area.polygon
        };
    };
}