import AppError from '../../../shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import FakeCacheProvider from '../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  test('Should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Eduardo Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  test('Should not be able to create a new user with same email', async () => {
    await createUser.execute({
      name: 'Eduardo Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Eduardo Teste',
        email: 'teste@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
