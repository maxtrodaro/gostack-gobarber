import AppError from '../../../shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  test('Should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Eduardo Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Eduardo Godoy',
      email: 'testando@testando.com',
    });

    expect(updatedUser.name).toBe('Eduardo Godoy');
    expect(updatedUser.email).toBe('testando@testando.com');
  });

  test('Should not be able to update the profile from wrong user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'wrong id',
        name: 'Wrong Test',
        email: 'test@example.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('Should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Eduardo Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'testando@testando.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Eduardo Godoy',
        email: 'teste@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('Should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Eduardo Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Eduardo Godoy',
      email: 'testando@testando.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  test('Should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Eduardo Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Eduardo Godoy',
        email: 'testando@testando.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('Should not be able to update the password wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Eduardo Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Eduardo Godoy',
        email: 'testando@testando.com',
        old_password: 'wrong-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
