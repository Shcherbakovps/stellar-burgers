import { FC } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  return (
    <AppHeaderUI userName={user?.name || ''} currentPath={location.pathname} />
  );
};
