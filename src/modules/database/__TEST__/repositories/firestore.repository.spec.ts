import { Test, TestingModule } from '@nestjs/testing';

import { Firestore } from 'firebase-admin/firestore';

import { FirestoreRepository } from '@modules/database';

// Mock interface for testing
interface TestEntity {
  id: string;
  name: string;
  value: number;
}

describe('RepositoryService', () => {
  let service: FirestoreRepository<TestEntity>;

  const collectionMock = {
    doc: jest.fn(),
    add: jest.fn(),
    where: jest.fn(),
    get: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
  };

  const firestoreMock = {
    collection: jest.fn().mockReturnValue(collectionMock),
  } as any;

  const mockCollection = 'test-collection';
  const mockEntity: TestEntity = {
    id: '1',
    name: 'Test',
    value: 123,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Firestore,
          useValue: firestoreMock,
        },
        {
          provide: mockCollection,
          useFactory: (firestore) =>
            new FirestoreRepository(firestore, mockCollection),
          inject: [Firestore],
        },
      ],
    }).compile();

    service = module.get<FirestoreRepository<TestEntity>>(mockCollection);
  });

  describe('when findAll method is called', () => {
    it('should return all documents', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ ...mockEntity }) },
        { id: '2', data: () => ({ ...mockEntity, id: '2' }) },
      ];

      collectionMock.orderBy = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: mockDocs,
        }),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockEntity);
    });

    it('should return empty array when no documents exist', async () => {
      collectionMock.orderBy = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: [],
        }),
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('when findOneById method is called', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return a document', async () => {
      const mockDocs = {
        id: '1',
        exists: true,
        data: () => ({ ...mockEntity }),
      };

      collectionMock.doc = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockDocs),
      });

      const result = await service.findOneById(mockEntity.id);

      expect(result).toEqual(mockEntity);
    });

    it('should return null when no documents exist', async () => {
      collectionMock.doc = jest.fn().mockReturnValue({
        exist: false,
        get: jest.fn().mockResolvedValue({
          docs: null,
        }),
      });

      const result = await service.findOneById(mockEntity.id);

      expect(result).toEqual(null);
    });
  });
});
