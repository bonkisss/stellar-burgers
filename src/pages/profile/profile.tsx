import { ProfileUI } from '@ui-pages';
import { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from 'react';
import { updateUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { selectUpdateUserError, selectUser } from '../../services/selectors';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUpdateUserError);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isNameChanged = formValue.name !== (user?.name || '');
  const isEmailChanged = formValue.email !== (user?.email || '');
  const isPasswordChanged = !!formValue.password;
  const isFormChanged = isNameChanged || isEmailChanged || isPasswordChanged;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const changedUserData: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (isNameChanged) {
      changedUserData.name = formValue.name;
    }
    if (isEmailChanged) {
      changedUserData.email = formValue.email;
    }
    if (isPasswordChanged) {
      changedUserData.password = formValue.password;
    }

    dispatch(updateUser(changedUserData))
      .unwrap()
      .then((updatedUser) => {
        setFormValue({
          name: updatedUser.name,
          email: updatedUser.email,
          password: ''
        });
      })
      .catch(() => {});
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={updateUserError || undefined}
    />
  );
};
