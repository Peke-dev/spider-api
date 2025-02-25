import { Test, TestingModule } from '@nestjs/testing';
import { FirestoreModule } from '../firestore.module';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';
import { CONFIG_PROVIDER_KEY } from '../constants';
import { FirestoreModuleOptions } from '../interfaces/module.interface';

jest.mock('firebase-admin/app');
jest.mock('firebase-admin/firestore');

describe('FirestoreModule', () => {
  let module: TestingModule;

  const moduleOptionsMock: FirestoreModuleOptions = {
    serviceAccount: {
      projectId: 'test-project',
      clientEmail: 'test@email.com',
      privateKey: 'test_private_key',
    },
  };

  describe('when forRootAsync method is called', () => {
    beforeAll(async () => {
      module = await Test.createTestingModule({
        imports: [
          FirestoreModule.registerAsync({
            useFactory: () => moduleOptionsMock,
          }),
        ],
      }).compile();
    });

    it('should create a dynamic module with async options', () => {
      const options = module.get<FirestoreModuleOptions>(CONFIG_PROVIDER_KEY);
      expect(options).toEqual(moduleOptionsMock);
    });

    it('should call initializeApp with the correct options', () => {
      expect(initializeApp).toHaveBeenCalledWith({
        credential: cert(moduleOptionsMock.serviceAccount),
      });
    });

    it('should call getFirestore', () => {
      expect(getFirestore).toHaveBeenCalled();
    });
  });
});
