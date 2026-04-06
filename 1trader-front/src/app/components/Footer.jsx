import { AppBar, Toolbar, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import useSettings from 'app/hooks/useSettings';
import { topBarHeight } from 'app/utils/constant';
import { Paragraph, Span } from './Typography';
import { Button } from 'reactstrap';

const AppFooter = styled(Toolbar)(() => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: topBarHeight,
  '@media (max-width: 499px)': {
    display: 'table',
    width: '100%',
    minHeight: 'auto',
    padding: '1rem 0',
    '& .container': {
      flexDirection: 'column !important',
      '& a': { margin: '0 0 16px !important' },
    },
  },
}));

const FooterContent = styled('div')(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '0px 1rem',
  maxWidth: '1170px',
  margin: '0 auto',
}));

const Footer = () => {
  const theme = useTheme();
  const { settings } = useSettings();

  const footerTheme = settings.themes[settings.footer.theme] || theme;

  return (
    <div >
      <AppBar color="primary" className='background-footer' position="static" sx={{ zIndex: 96 }}>
        <AppFooter>
          <Grid item container sm={12} md={12} className='content-footer'>
            <Grid sm={12} md={6}  >
              <a className='about-company'>
                Quienes somos
              </a>
            </Grid>
            <Grid sm={12} md={6} >
              <p className='about-contact'>
                Contacto: gambatte@gmail.com
              </p>
            </Grid>
          </Grid>

        </AppFooter>
      </AppBar>
    </div>
  );
};

export default Footer;
