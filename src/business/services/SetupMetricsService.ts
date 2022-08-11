import { Injectable } from "@nestjs/common";
import { MetricsService } from "ameixa-shared/metrics/MetricsService";
import { HealthService } from "./HealthService";

@Injectable()
export class SetupMetricsService {
    constructor(metricsService: MetricsService, healthService: HealthService){
        metricsService.watchDependencies(async checkDependency => {
            checkDependency({
                name: 'postgres',
                up: await healthService.databaseIsHealth
            });
        });

        const nameProject = process.env.npm_package_name;
        const versionProject = process.env.npm_package_version;
        metricsService.setupApplicationInfo(nameProject, versionProject)
    }
}