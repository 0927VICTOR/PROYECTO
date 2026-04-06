
import { ThemeProvider, useMediaQuery } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { MatxSuspense } from 'app/components';
import useSettings from 'app/hooks/useSettings';
import { ROL_USER, ROL_USER_ADMIN, sidenavCompactWidth, sideNavWidth } from 'app/utils/constant';
import React, { useEffect, useRef } from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import { Outlet } from 'react-router-dom';
import Footer from '../../Footer';
import SidenavTheme from '../../MatxTheme/SidenavTheme/SidenavTheme';
import SecondarySidebar from '../../SecondarySidebar/SecondarySidebar';
import Layout1Sidenav from './Layout1Sidenav';
import Layout1Topbar from './Layout1Topbar';

import { initiateSocket } from '../../../services/socket'
import { useState } from 'react';
import useNotification from 'app/hooks/useNotification';
import { Message } from 'app/components/Notification/Notification';
import useAuth from 'app/hooks/useAuth';

const Layout1Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  background: theme.palette.background.default,
}));

const ContentBox = styled(Box)(() => ({
  height: '100%',
  display: 'flex',
  overflowY: 'auto',
  overflowX: 'hidden',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const StyledScrollBar = styled(Scrollbar)(() => ({
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexGrow: '1',
  flexDirection: 'column',
}));

const LayoutContainer = styled(Box)(({ width, secondarySidebar }) => ({
  height: '100vh',
  display: 'flex',
  flexGrow: '1',
  flexDirection: 'column',
  verticalAlign: 'top',
  marginLeft: width,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  marginRight: secondarySidebar.open ? 50 : 0,
}));

const Layout1 = () => {
  const { settings, updateSettings } = useSettings();
  const { layout1Settings, secondarySidebar } = settings;
  const topbarTheme = settings.themes[layout1Settings.topbar.theme];
  const {
    leftSidebar: { mode: sidenavMode, show: showSidenav },
  } = layout1Settings;

  const getSidenavWidth = () => {
    switch (sidenavMode) {
      case 'full':
        return sideNavWidth;

      case 'compact':
        return sidenavCompactWidth;

      default:
        return '0px';
    }
  };

  const sidenavWidth = getSidenavWidth();
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

  const ref = useRef({ isMdScreen, settings });
  const layoutClasses = `theme-${theme.palette.type}`;

  const [notification, setNotificationData] = useState([])

  const { logout, user } = useAuth();

  useEffect(() => {
    let { settings } = ref.current;
    let sidebarMode = settings.layout1Settings.leftSidebar.mode;
    if (settings.layout1Settings.leftSidebar.show) {
      let mode = isMdScreen ? 'close' : sidebarMode;
      updateSettings({ layout1Settings: { leftSidebar: { mode } } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMdScreen]);

  useEffect(() => {
    if (user.role === ROL_USER_ADMIN) {
      initiateSocket().on('notificatios-users', ({ data }) => {
        if (data !== undefined && data?.length > 0) {
          let mapData = []
          let filterData = []
          filterData = data?.filter(x => x?.rol_idrol === 2 && x?.cant_deposits > 0 || x?.cant_expenses > 0)
          if (filterData?.length > 0) {
            mapData = filterData.map(el => {
              return {
                id: el.id,
                heading: el.fullName,
                icon: {
                  name: 'monetization_on',
                  color: 'monetization_on',
                },
                deposits: {
                  title: 'Solicitud Depositos',
                  quantity: el?.cant_deposits
                },
                expenses: {
                  title: 'Solicitud Retiros',
                  quantity: el?.cant_expenses
                },
                subtitle: 'Hello, Any progress...',
                path: 'chat',
              }
            })
          }
          setNotificationData(mapData)
        }
      })
      return () => initiateSocket().close();
    }
  }, [])

  useEffect(() => {
    initiateSocket().on("notification-created", ({ msg, type, operationType }) => {
      if (user.role === ROL_USER_ADMIN && type == 'Admin') {
        Message('success', `${operationType}`, msg)
      }
    })
    return () => initiateSocket().close();
  }, {})


  useEffect(() => {
    initiateSocket().on("notification", ({ msg, type, operationType }) => {
      if (user.role === ROL_USER && type == 'User') {
        Message('success', `${operationType}`, msg)
      }
      if (user.role === ROL_USER_ADMIN && type == 'Admin') {
        Message('success', `${operationType}`, msg)
      }
    })
    return () => initiateSocket().close();
  }, {})

  return (
    <Layout1Root className={layoutClasses}>
      {showSidenav && sidenavMode !== 'close' && (
        <SidenavTheme>
          <Layout1Sidenav />
        </SidenavTheme>
      )}

      <LayoutContainer width={sidenavWidth} secondarySidebar={secondarySidebar}>
        {layout1Settings.topbar.show && layout1Settings.topbar.fixed && (
          <ThemeProvider theme={topbarTheme}>
            <Layout1Topbar fixed={true} notification={notification} className="elevation-z8" />
          </ThemeProvider>
        )}

        {settings.perfectScrollbar && (
          <StyledScrollBar>
            {layout1Settings.topbar.show && !layout1Settings.topbar.fixed && (
              <ThemeProvider theme={topbarTheme}>
                <Layout1Topbar />
              </ThemeProvider>
            )}
            <Box flexGrow={1} position="relative">
              <MatxSuspense>
                <Outlet />
              </MatxSuspense>
            </Box>

            {settings.footer.show && !settings.footer.fixed && <Footer />}
          </StyledScrollBar>
        )}

        {!settings.perfectScrollbar && (
          <ContentBox>
            {layout1Settings.topbar.show && !layout1Settings.topbar.fixed && (
              <ThemeProvider theme={topbarTheme}>
                <Layout1Topbar />
              </ThemeProvider>
            )}

            <Box flexGrow={1} position="relative">
              <MatxSuspense>
                <Outlet />
              </MatxSuspense>
            </Box>

            {settings.footer.show && !settings.footer.fixed && <Footer />}
          </ContentBox>
        )}

        {settings.footer.show && settings.footer.fixed && <Footer />}
      </LayoutContainer>

      {settings.secondarySidebar.show && <SecondarySidebar />}
    </Layout1Root>
  );
};

export default React.memo(Layout1);
