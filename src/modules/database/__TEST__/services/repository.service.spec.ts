import { Test, TestingModule } from '@nestjs/testing';

import { Firestore, CollectionReference, DocumentData } from '@google-cloud/firestore';

import { RepositoryService } from '@modules/database/services';
import { exist } from 'joi';

// Mock interface for testing
interface TestEntity {
  id: string;
  name: string;
  value: number;
}

describe('RepositoryService', () => {
  let service: RepositoryService<TestEntity>;
  let firestore: Firestore;
  let collectionMock: jest.Mocked<CollectionReference<DocumentData>>;

  const mockCollection = 'test-collection';
  const mockEntity: TestEntity = {
    id: '1',
    name: 'Test',
    value: 123
  };

  beforeAll(async () => {
    collectionMock = {
      doc: jest.fn(),
      add: jest.fn(),
      where: jest.fn(),
      get: jest.fn(),
      orderBy: jest.fn(),
      limit: jest.fn()
    } as any;

    // Create mock firestore
    firestore = {
      collection: jest.fn().mockReturnValue(collectionMock)
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Firestore,
          useValue: firestore
        },
        {
          provide: mockCollection,
          useFactory: (firestore) => new RepositoryService(firestore, mockCollection),
          inject: [Firestore]
        }
      ],
    }).compile();

    service = module.get<RepositoryService<TestEntity>>(mockCollection);
  });

  describe('when findAll method is called', () => {
    it('should return all documents', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ ...mockEntity }) },
        { id: '2', data: () => ({ ...mockEntity, id: '2' }) }
      ];
      
      collectionMock.orderBy = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            docs: mockDocs
          })
        })
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockEntity);
    });

    it('should return empty array when no documents exist', async () => {
      collectionMock.orderBy = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            docs: []
          })
        })
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
      const mockDocs = { id: '1',exists: true, data: () => ({ ...mockEntity }) }
      
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
          docs: null
        })
      });

      const result = await service.findOneById(mockEntity.id);

      expect(result).toEqual(null);
    });
  });
}); 