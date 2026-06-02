import { checkUserAuth, loginUser, updateUser, userReducer } from './userSlice';

const user = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('userReducer', () => {
  it('sets loading on auth check request', () => {
    const state = userReducer(undefined, checkUserAuth.pending(''));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores user on login success', () => {
    const state = userReducer(
      undefined,
      loginUser.fulfilled(user, '', {
        email: 'test@example.com',
        password: '123'
      })
    );

    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('stores error on login failed request', () => {
    const state = userReducer(
      undefined,
      loginUser.rejected(new Error('Ошибка входа'), '', {
        email: 'test@example.com',
        password: '123'
      })
    );

    expect(state.error).toBe('Ошибка входа');
    expect(state.isLoading).toBe(false);
  });

  it('stores update user error on update failed request', () => {
    const state = userReducer(
      undefined,
      updateUser.rejected(new Error('Ошибка обновления'), '', { name: 'New' })
    );

    expect(state.updateUserError).toBe('Ошибка обновления');
    expect(state.isLoading).toBe(false);
  });
});
