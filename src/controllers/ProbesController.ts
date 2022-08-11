import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthService } from '../business/services/HealthService';

@Controller('')
@ApiTags()
export class ProbesController {
    constructor(private healthService: HealthService) {
    }

    @Get('/health')
    public isHealth(): Promise<boolean> {
        return this.healthService.isHealth;
    }
}