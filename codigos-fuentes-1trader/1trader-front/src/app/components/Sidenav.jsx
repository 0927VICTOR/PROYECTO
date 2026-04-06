import { styled } from '@mui/system';
import { MatxVerticalNav } from 'app/components';
import useAuth from 'app/hooks/useAuth';
import useSettings from 'app/hooks/useSettings';
import { navigations, navigationsUser } from 'app/navigations';
import { ROL_USER, ROL_USER_ADMIN } from 'app/utils/constant';
import { Fragment } from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import { useDispatch } from 'react-redux';

import { initalGlobalStore } from '../redux/InitialGlobalStore'

const StyledScrollBar = styled(Scrollbar)(() => ({
  paddingLeft: '1rem',
  paddingRight: '1rem',
  position: 'relative',
}));

const SideNavMobile = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100vw',
  background: 'rgba(0, 0, 0, 0.54)',
  zIndex: -1,
  [theme.breakpoints.up('lg')]: { display: 'none' },
}));

const Sidenav = ({ children }) => {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth()

  const dispatch = useDispatch();

  const updateSidebarMode = (sidebarSettings) => {
    let activeLayoutSettingsName = settings.activeLayout + 'Settings';
    let activeLayoutSettings = settings[activeLayoutSettingsName];
    updateSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  const redirectToValidRoUser = () => {
    if (user.role == ROL_USER) {
      dispatch(initalGlobalStore.getAllDeposits((error) => { }))
      dispatch(initalGlobalStore.getAllExpenses((error) => { }))
      dispatch(initalGlobalStore.getAllUsers())
      dispatch(initalGlobalStore.getEarningPaymentsThunk((error) => { }))
      return navigationsUser
    }
    else if (user.role == ROL_USER_ADMIN) {
      dispatch(initalGlobalStore.getAllUsers())
      dispatch(initalGlobalStore.getAllExpenses((error) => { }))
      dispatch(initalGlobalStore.getEarningPaymentsThunk((error) => { }))
      dispatch(initalGlobalStore.getAllUserSystemThunk((error) => { }))
      dispatch(initalGlobalStore.getAllActivesThunk((error) => { }))
      return navigations
    }
  }
  return (
    <Fragment>
      <StyledScrollBar options={{ suppressScrollX: true }}>
        {children}
        <MatxVerticalNav items={redirectToValidRoUser()} />
      </StyledScrollBar>

      <SideNavMobile onClick={() => updateSidebarMode({ mode: 'close' })} />
    </Fragment>
  );
};

export default Sidenav;
