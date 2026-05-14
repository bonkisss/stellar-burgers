import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/selectors';

export const AppHeader: FC = () => {
  const { pathname } = useLocation();
  const userName = useSelector(selectUser)?.name;

  return <AppHeaderUI userName={userName} pathname={pathname} />;
};
