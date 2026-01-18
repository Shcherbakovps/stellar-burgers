import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useCallback, useRef } from 'react';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { ProtectedRoute } from '../protected-route';
import { Modal } from '@components';
import { OrderInfo, IngredientDetails } from '@components';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import { getUser } from '../../services/slices/auth-slice';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  // Если есть background, используем его для модалки, но основной Routes всегда на текущем location
  const state = location.state as { background?: typeof location } | null;

  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(getUser());
    }
    // dispatch стабилен, но ESLint требует его в зависимостях
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModalClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className={styles.app}>
      {!isAuthChecked ? (
        <Preloader />
      ) : (
        <>
          <AppHeader />

          {/* Основной роутинг всегда на текущем location */}
          <Routes>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {/* Модалки — только на "фоновом" экране, и исключаем страницы логина/регистрации */}
          {state?.background &&
            ![
              '/login',
              '/register',
              '/forgot-password',
              '/reset-password'
            ].includes(state.background.pathname) && (
              <Routes location={state.background}>
                <Route
                  path='/feed/:number'
                  element={
                    <Modal title='' onClose={handleModalClose}>
                      <OrderInfo />
                    </Modal>
                  }
                />
                <Route
                  path='/ingredients/:id'
                  element={
                    <Modal
                      title='Детали ингредиента'
                      onClose={handleModalClose}
                    >
                      <IngredientDetails />
                    </Modal>
                  }
                />
                <Route
                  path='/profile/orders/:number'
                  element={
                    <ProtectedRoute>
                      <Modal title='' onClose={handleModalClose}>
                        <OrderInfo />
                      </Modal>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            )}
        </>
      )}
    </div>
  );
};

export default App;
