import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from 'ameixa-shared/DatabaseModule';

import { BindUserMiddleware } from 'ameixa-shared/BindUserMiddleware';
import { MetricsModule } from "ameixa-shared/metrics/MetricsModule";


@Module({
    imports: [ MetricsModule, DatabaseModule ],
    controllers: [ /* ProbesController, AreaController, LocationController */ ],
    providers: [ /* HealthService, AreaApp, Repository, LocationApp, GoogleService, Logger, SetupMetricsService */ ],
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): any {
        consumer.apply(BindUserMiddleware).forRoutes('*');
    }
}
