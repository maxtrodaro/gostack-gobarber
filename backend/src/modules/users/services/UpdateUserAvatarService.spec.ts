import AppError from '../../../shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  test('Should be able to update avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Eduardo Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  test('Should not be able to update avatar from no user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'no-user',
        avatar_filename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('Should be able to delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Eduardo Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
