import AppError from '../../../shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  test('Should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Eduardo Teste',
      email: 'teste@teste.com',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Eduardo Teste');
    expect(profile.email).toBe('teste@teste.com');
  });

  test('Should not be able to show the profile from wrong user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'wrong id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
