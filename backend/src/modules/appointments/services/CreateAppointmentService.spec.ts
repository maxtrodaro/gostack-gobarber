import AppError from '../../../shared/errors/AppError';
import FakeNotificationRepository from '../../notifications/repositories/fakes/FakeNotificationRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
  });

  test('Should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 6, 10, 13),
      user_id: '123123',
      provider_id: '12345',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12345');
  });

  test('Should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 6, 10, 12);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '12345',
      user_id: '123123',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '12345',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('Should not be able to create two appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 10, 11),
        provider_id: '12345',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('Should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 10, 14),
        provider_id: 'user-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('Should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 11, 7),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 11, 18),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
