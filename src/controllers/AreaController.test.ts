import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { Logger, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { BindUserMiddleware } from 'ameixa-shared/BindUserMiddleware';
import {
    fakeAdminToken,
    fakeClientToken,
    fakeLogger,
    fakeLogisticsToken,
    fakeSystemToken
} from 'ameixa-shared/tests/constants';
import * as request from 'supertest';
import { AreaController } from './AreaController';
import { AreaApp } from '../business/apps/AreaApp';
import { fakeArea } from '../tests/areas';
import { Area } from '../business/types/Area';
import { fakeStringLatLng } from '../tests/constants';
import { AreaDto } from '../business/types/dto/AreaDto';
import { AreaViewModel } from '../business/types/view-models/AreaViewModel';
import { fakeAreaDto } from '../tests/dto/fakeAreaDto';
import Mock = jest.Mock;

@Module({
    controllers: [AreaController],
    providers: [AreaApp, Logger]
})
class AreaControllerTestModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): any {
        consumer.apply(BindUserMiddleware).forRoutes('*');
    }
}

const urlController = '/area';

describe('area controller tests', () => {
    let expressApp: NestApplication;
    let app: AreaApp;

    beforeEach(async () => {
        app = {
            list: () => Promise.resolve([fakeArea]),
            update: () => Promise.resolve([fakeArea]),
            get: () => Promise.resolve(fakeArea)
        } as unknown as AreaApp;

        const moduleFixture = await Test.createTestingModule({
            imports: [AreaControllerTestModule]
        })
            .overrideProvider(AreaApp)
            .useValue(app)
            .overrideProvider(Logger)
            .useValue(fakeLogger)
            .compile();

        expressApp = moduleFixture.createNestApplication();
        expressApp.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
        await expressApp.init();
        jest.clearAllMocks();
    });

    describe('list', () => {
        it('should list all the areas', async () => {
            jest.spyOn(app, 'list');

            const body: AreaViewModel[] = await request(expressApp.getHttpServer())
                .get(urlController)
                .set('Authorization', fakeAdminToken)
                .expect(200)
                .then(x => x.body);

            expect(app.list).toBeCalled();

            const [first] = body;

            expect(first.id).toBe(fakeArea.id);
            expect(first.name).toBe(fakeArea.name);
            expect(first.deliveryFee.business).toBe(fakeArea.businessDeliveryFee);
            expect(first.deliveryFee.individual).toBe(fakeArea.individualDeliveryFee);
            expect(first.polygon).toStrictEqual(fakeArea.polygon);
        });

        it('should verify the authorization and authentication', async () => {
            const agent = request(expressApp.getHttpServer());

            await agent.get(urlController).expect(403);
            await agent.get(urlController)
                .set('Authorization', fakeClientToken)
                .expect(403);
        });
    });

    describe('get', () => {
        it('should get the area', async () => {
            jest.spyOn(app, 'get');

            const { lat, lng } = fakeStringLatLng;
            const body: AreaViewModel = await request(expressApp.getHttpServer())
                .get(`${urlController}/${lat}/${lng}`)
                .set('Authorization', fakeSystemToken)
                .expect(200)
                .then(x => x.body);

            expect(app.get).toBeCalledWith(lat, lng);

            const first = body;

            expect(first.id).toBe(fakeArea.id);
            expect(first.name).toBe(fakeArea.name);
            expect(first.deliveryFee.business).toBe(fakeArea.businessDeliveryFee);
            expect(first.deliveryFee.individual).toBe(fakeArea.individualDeliveryFee);
            expect(first.polygon).toStrictEqual(fakeArea.polygon);
        });

        it('should verify the authentication', async () => {
            const { lat, lng } = fakeStringLatLng;

            await request(expressApp.getHttpServer())
                .get(`${urlController}/${lat}/${lng}`)
                .expect(403);
        });

        it('should verify the authorization', async () => {
            const { lat, lng } = fakeStringLatLng;

            await request(expressApp.getHttpServer())
                .get(`${urlController}/${lat}/${lng}`)
                .set('Authorization', fakeLogisticsToken)
                .expect(403);
        });
    });

    describe('update', () => {
        it(' should update the area', async () => {
            jest.spyOn(app, 'update')
                .mockResolvedValue([fakeArea]);

            const body: AreaViewModel[] = await request(expressApp.getHttpServer())
                .put(urlController)
                .set('Authorization', fakeLogisticsToken)
                .send([fakeAreaDto])
                .expect(200)
                .then(x => x.body);

            expect(app.update).toHaveBeenCalled();

            const [passed] = (app.update as Mock).mock.calls[0][0] as Area[];

            expect(passed.name).toBe(fakeAreaDto.name);
            expect(passed.businessDeliveryFee).toBe(fakeAreaDto.deliveryFee.business);
            expect(passed.individualDeliveryFee).toBe(fakeAreaDto.deliveryFee.individual);
            expect(passed.polygon).toStrictEqual(fakeAreaDto.polygon);

            const [area] = body;

            expect(area.id).toBe(fakeArea.id);
            expect(area.name).toBe(fakeArea.name);
            expect(area.deliveryFee.business).toStrictEqual(fakeArea.businessDeliveryFee);
            expect(area.deliveryFee.individual).toStrictEqual(fakeArea.individualDeliveryFee);
            expect(area.polygon).toStrictEqual(fakeArea.polygon);
        });

        it('should verify the authentication and authorization ', async () => {
            const agent = request(expressApp.getHttpServer());

            await agent.put(urlController)
                .send(fakeArea)
                .expect(403);

            await agent.put(urlController)
                .set('Authorization', fakeAdminToken)
                .send(fakeArea)
                .expect(403);
        });

        const executeInvalidUpdate = (partial: Partial<AreaDto>): () => Promise<void> => async () => {
            await request(expressApp.getHttpServer())
                .put(urlController)
                .set('Authorization', fakeLogisticsToken)
                .send([{ ...fakeAreaDto, ...partial }])
                .expect(400);
        };

        it('should verify if name is defined', executeInvalidUpdate({ name: '' }));

        it('should validate business delivery fee', executeInvalidUpdate({
            deliveryFee: {
                business: -2,
                individual: 5
            }
        }));

        it('should validate individual delivery fee', executeInvalidUpdate({
            deliveryFee: {
                individual: -1,
                business: 5
            }
        }));

        it('should verify invalid polygon', executeInvalidUpdate({
            polygon: [
                { lat: 34.0772164, lng: -118.4238677 },
                { lat: 34.0872484, lng: -118.4022167 }
            ]
        }));
    });

});