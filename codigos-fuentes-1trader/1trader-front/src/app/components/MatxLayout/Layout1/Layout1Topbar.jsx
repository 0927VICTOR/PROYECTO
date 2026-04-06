import { Avatar, Hidden, Icon, IconButton, MenuItem, useMediaQuery } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { MatxMenu, MatxSearchBox } from 'app/components';
import { themeShadows } from 'app/components/MatxTheme/themeColors';
import { NotificationProvider } from 'app/contexts/NotificationContext';
import useAuth from 'app/hooks/useAuth';
import useSettings from 'app/hooks/useSettings';
import { BASE_URL_DEV, BASE_URL_PROD, IMG_AVATAR, topBarHeight } from 'app/utils/constant';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Span } from '../../../components/Typography';
import NotificationBar from '../../NotificationBar/NotificationBar';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash'
import { initiateSocket } from 'app/services/socket';
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const TopbarRoot = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 96,
  transition: 'all 0.3s ease',
  boxShadow: themeShadows[8],
  height: topBarHeight,
}));

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: '8px',
  paddingLeft: 18,
  paddingRight: 20,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: 14,
    paddingRight: 16,
  },
}));

const UserMenu = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: 24,
  padding: 4,
  '& span': { margin: '0 8px' },
}));

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: 185,
  '& a': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  '& span': { marginRight: '10px', color: theme.palette.text.primary },
}));

const IconBox = styled('div')(({ theme }) => ({
  display: 'inherit',
  [theme.breakpoints.down('md')]: { display: 'none !important' },
}));

const Layout1Topbar = ({ notification }) => {

  const [usersData, setUsersData] = useState([]);
  let { users } = useSelector((state) => state.users);
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  //  Recuperamos el rol del usuario
  const { logout, user } = useAuth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } },
    });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === 'close' ? 'mobile' : 'close';
    } else {
      mode = layout1Settings.leftSidebar.mode === 'full' ? 'close' : 'full';
    }
    updateSidebarMode({ mode });
  };

  useEffect(() => {
    const socket = initiateSocket()
    socket.on('users', ({ users }) => {
      // console.log('usersData', users, 'User', user.fullName, 'id', user.id);
      if (users.length > 0) {
        users = _.filter(
          users,
          (userFilter) => userFilter.id == user.id && userFilter.role == user.role
        );
        setUsersData(users)
        setFilterUserNavBar()
      }
      return () => initiateSocket().close();
    })
    return () => initiateSocket().close();
  }, [])

  const setFilterUserNavBar = () => {
    let u
    // console.log('usersData', usersData, 'User', user);
    if (usersData[0]?.role == 'User') {
      u = {
        fullName: usersData[0]?.fullName,
        avatar: usersData[0]?.avatar,
        role: usersData[0]?.role
      }
    }
    if (usersData[0]?.role == 'Admin') {
      u = {
        fullName: usersData[0]?.fullName,
        avatar: usersData[0]?.avatar,
        role: usersData[0]?.role
      }
    }
    return u
  }

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Icon>menu</Icon>
          </StyledIconButton>

          <IconBox>
            {/* <StyledIconButton>
              <Icon>mail_outline</Icon>
            </StyledIconButton> */}

            {/* <StyledIconButton>
              <Icon>web_asset</Icon>
            </StyledIconButton> */}

            {/* <StyledIconButton>
              <Icon>star_outline</Icon>
            </StyledIconButton> */}
          </IconBox>
        </Box>

        <Box display="flex" alignItems="center">
          {/* <MatxSearchBox /> */}

          {user.role != 'User' && <NotificationProvider>
            <NotificationBar notificationsUsers={notification} />
          </NotificationProvider>}

          {/* <ShoppingCart /> */}

          <MatxMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  <Span>
                    <strong>{setFilterUserNavBar()?.fullName}</strong>
                  </Span>
                </Hidden>
                <Avatar src={setFilterUserNavBar()?.avatar ? `${BASE_URL_PROD}/user/photo/${setFilterUserNavBar()?.avatar}` : IMG_AVATAR} sx={{ cursor: 'pointer' }} />
              </UserMenu>
            }
          >
            {/* <StyledItem>
              <Link to="/">
                <Icon> home </Icon>
                <Span> Home </Span>
              </Link>
            </StyledItem> */}

            {setFilterUserNavBar()?.role === 'User' && <StyledItem>
              <Link to={'/customer/perfil'}>
                <Icon> person </Icon>
                <Span> Profile </Span>
              </Link>
            </StyledItem>}

            {/* <StyledItem>
              <Icon> settings </Icon>
              <Span> Settings </Span>
            </StyledItem> */}
            <StyledItem onClick={() => {
              // console.log('Saliendo');
              logout(user.id)
            }}>
              <Icon> power_settings_new </Icon>
              <Span> Salir </Span>
            </StyledItem>
          </MatxMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default React.memo(Layout1Topbar);
