import { Box, Grid, Typography, styled } from '@mui/material';
import Tooltip from '@material-ui/core/Tooltip';
import { MatxLogo } from 'app/components';
import useSettings from 'app/hooks/useSettings';
import { Span } from './Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import useAuth from 'app/hooks/useAuth';
import { useSelector } from 'react-redux';
import _ from 'lodash'
import { useEffect } from 'react';
import { Button } from 'reactstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const BrandRoot = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 18px 20px 29px',
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 18,
  marginLeft: '.5rem',
  display: mode === 'compact' ? 'none' : 'block',
}));

const Brand = ({ children }) => {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  const { user } = useAuth();
  let { users } = useSelector((state) => state.users);

  // const [msg, setMsg] = useState([
  //   { value: 1, label: "Falta subir los documentos" },
  //   { value: 2, label: "Falta completar los campos" },
  // ]);

  const [msg, setMsg] = useState([]);

  useEffect(() => {
    if (users.length > 0) {
      setFilterUser()
    }
  }, [users]);

  const setFilterUser = () => {
    let u
    let m
    users = _.filter(
      users,
      (userFilter) => userFilter.id == user.id)
    if (users[0]?.role == 'User') {
      u = {
        accountVerify: users[0]?.accountVerify,
        msg: users[0]?.description?.split(',')
      }
    }
    return u
  }

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        <Grid display={'flex'} flexDirection={'column'}>
          <Grid>
            <a href='https://www.1trader.online' >
              <MatxLogo />
            </a>
          </Grid>
          {setFilterUser()?.accountVerify === 1 ?
            (<Grid className='mt-2'>
              <Typography color={'#00cd00'} fontSize={11}>Cuenta verificada
                <FontAwesomeIcon style={{ marginLeft: '2px', fontSize: '12px', color: '#008d00' }} icon={faCheck} />
              </Typography>
            </Grid>
            ) : setFilterUser()?.accountVerify === 2 || setFilterUser()?.accountVerify === null ?
              (
                <div className='mt-2' data-tooltip-id="my-tooltip" >
                  <Tooltip title={setFilterUser()?.msg?.map(el => {
                    return (<p>{el}</p>)
                  })}>
                    <Typography fontSize={11}>Cuenta sin verificar
                      <FontAwesomeIcon style={{ marginLeft: '2px', fontSize: '12px' }} icon={faExclamationTriangle} />
                    </Typography>
                  </Tooltip>
                </div>
              ) : false}

        </Grid>
        {/* <StyledSpan mode={mode} className="sidenavHoverShow">
          Matx
        </StyledSpan> */}
      </Box>

      {/* <Box className="sidenavHoverShow" sx={{ display: mode === 'compact' ? 'none' : 'block' }}>
        {children || null}
      </Box> */}
    </BrandRoot >
  );
};

export default Brand;
