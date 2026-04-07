import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/system';
import useAuth from 'app/hooks/useAuth';
import { useFormik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import './resources/css/bootstrap.min.css';
import './resources/css/style.css';
import './resources/css/font-awesome.min.css';
import {
  Form,
  FormGroup,
  Input,
} from 'reactstrap'
import AvatarLogin from './resources/images/avatar-perfil.jpg';
import { Paragraph } from 'app/components/Typography';


import { Message } from 'app/components/Notification/Notification';
import { Grid } from '@mui/material';
import { MatxLogo } from 'app/components';

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();

  const mailformat = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/

  const formikLigin = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('El email es requerido')
        .matches(mailformat, 'Dirección de email invàlida'),
      password: Yup.string()
        .min(6, 'La contraseña debe de tener al menos 6 dìgitos')
        .required('La contraseña es requerida'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let { user: userClient } = await login({ data: { user: { email: values.email, password: values.password } } });
        if (userClient !== null) {
          if (userClient.role === 'User') {
            navigate('/');
          }
          if (userClient.role === 'Admin') {
            navigate('/admin/user');
          }
        }
      } catch (e) {
        setLoading(false);
        if (e.message === 'Network Error') {
          Message('warning', 'Login', 'Lo sentimos el sistema no esta diponible en estos momentos.')
        }
        else {
          Message('error', 'Login', 'Usuario o contraseña inválida.')
        }
      }
    }
  })

  /*const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (e) {
      setLoading(false);
    }
  };*/

  return (
    <section className="form-01-main">
      <div className="form-cover">
        <Grid className='logo-login container' marginTop={5}>
          <a href='https://www.1trader.online' >
            <MatxLogo />
          </a>
        </Grid>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="form-sub-main">
                <div className="_main_head_as">
                  <a href="#">
                    <img src={AvatarLogin} />
                  </a>
                </div>
                <div>
                  <Form>
                    <FormGroup className="mb-5">
                      <Input
                        type="text"
                        name="email"
                        placeholder="Ingrese la dirección de correo"
                        onChange={formikLigin.handleChange}
                        onBlur={formikLigin.handleBlur}
                        value={formikLigin.values.email}
                        className='inputLogin'
                      />
                      {formikLigin.touched.email && formikLigin.errors.email && <div className="div-erros-login bg-red-500 border-l-4">
                        <p >{formikLigin.touched.email && formikLigin.errors.email}</p>
                      </div>}
                    </FormGroup>
                  </Form>
                </div>

                <div>
                  <Form>
                    <FormGroup className="mb-5">
                      <Input
                        type="password"
                        name="password"
                        placeholder="******************"
                        onChange={formikLigin.handleChange}
                        onBlur={formikLigin.handleBlur}
                        value={formikLigin.values.password}
                        className='inputLogin'
                      />
                      {formikLigin.touched.password && formikLigin.errors.password && <div className="div-erros-login bg-red-500 border-l-4">
                        <p >{formikLigin.touched.password && formikLigin.errors.password}</p>
                      </div>}
                    </FormGroup>
                  </Form>
                </div>

                <div >
                  <div className="check_box_main">
                    <Paragraph className={"pas-text"}>
                      No tienes una cuenta ?
                      <NavLink
                        to="/session/signup"
                        style={{ marginLeft: 5 }}
                        className={"pas-text"}>
                        Registrate
                      </NavLink>
                    </Paragraph>
                  </div>

                </div>

                <div className="form-group">
                  <div className="btn_uy">
                    <LoadingButton
                      type="submit"
                      size='large'
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 1 }}
                      style={{ cursor: 'pointer', background: '#ecab0f', width: '100%' }}
                      onClick={formikLigin.handleSubmit}
                    >
                      Login
                    </LoadingButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JwtLogin;
