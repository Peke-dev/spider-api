import { RepositoryInterface } from '../../interfaces';

export const repositoryMock = {
  findAll: jest.fn(),
  findOneById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findOneBy: jest.fn(),
};

export const createRepositoryMock = <T>(): RepositoryInterface<T> => ({
  findAll: jest.fn(),
  findOneById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findOneBy: jest.fn(),
});
