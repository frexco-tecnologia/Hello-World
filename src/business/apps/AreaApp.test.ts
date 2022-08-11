import { AreaApp } from './AreaApp';
import { Test } from '@nestjs/testing';
import { fakeArea } from '../../tests/areas';
import { Repository } from '../repositories/Repository';
import { Area } from '../types/Area';
import { Logger } from '@nestjs/common';
import { fakeLogger } from 'ameixa-shared/tests/constants';
import Mock = jest.Mock;

describe('area app tests', () => {
    let target: AreaApp;
    let repo: Repository;

    beforeEach(async () => {
        repo = {
            list: () => Promise.resolve([fakeArea]),
            delete: () => Promise.resolve(),
            insert: () => Promise.resolve([fakeArea]),
            findByLatLng: () => Promise.resolve(fakeArea)
        } as unknown as Repository;

        const moduleFixture = await Test.createTestingModule({
            providers: [AreaApp, Repository, Logger]
        })
            .overrideProvider(Logger)
            .useValue(fakeLogger)
            .overrideProvider(Repository)
            .useValue(repo)
            .compile();

        target = moduleFixture.get(AreaApp);

        jest.clearAllMocks();
    });

    describe('list', () => {
        it('should list all the areas', async () => {
            const result = await target.list();

            expect(result).toStrictEqual([fakeArea]);
        });
    });

    describe('update', () => {
        it('should update the area', async () => {
            jest.spyOn(repo, 'delete');
            jest.spyOn(repo, 'insert');

            const result = await target.update([fakeArea]);

            expect(repo.delete).toBeCalled();
            expect(repo.insert).toBeCalled();

            expect(result).toStrictEqual([fakeArea]);

            const passedToRepo = (repo.insert as Mock).mock.calls[0][0][0] as Area;
            expect(passedToRepo.id).toBeUndefined();
        });

        it('should close polygon', async () => {
            jest.spyOn(repo, 'insert');

            const area: Area = {
                ...fakeArea,
                polygon: [
                    { lat: -12.9953688, lng: -38.4671757 },
                    { lat: -12.9824678, lng: -38.4607487 },
                    { lat: -12.9814428, lng: -38.4762087 },
                    { lat: -12.9897648, lng: -38.4867337 }
                ]
            };
            const result = await target.update([area]);

            const passedToRepo = (repo.insert as Mock).mock.calls[0][0][0] as Area;
            expect(passedToRepo.polygon).toHaveLength(5);
        });
    });
});
    