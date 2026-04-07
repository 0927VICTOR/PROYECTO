import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Typography } from '@mui/material';
import useAuth from 'app/hooks/useAuth';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import './resources/css/bootstrap.min.css';
import './resources/css/font-awesome.min.css';
import './resources/css/style.css';

import { Form, FormGroup, Input, Label } from 'reactstrap';
import NumberFormat from "react-number-format";
import { getCountries } from 'app/services/utils.services';
import SelectComponent from 'app/components/select/SelectComponent';

import Select, {
  components,
  OptionProps,
  MultiValue,
  SingleValue
} from "react-select";
import TermAndConditions from 'app/components/Term-conditions/TermAndConditions';
import { MatxLogo } from 'app/components';

const JwtRegister = () => {

  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [valueCountry, setValueCountry] = useState(null);
  const [optionsCountries, setOptionsCountries] = useState([]);
  const [modalTermAndConditions, setModalTermAndConditions] = useState(false);
  const toggleModalTermAndConditions = () => {
    setModalTermAndConditions(!modalTermAndConditions);
  }

  const mailformat = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/

  const registerFormik = useFormik({
    initialValues: {
      fullName: "",
      documentType: "",
      documentNumber: "",
      indicative: '',
      phone: '',
      email: "",
      password: "",
      passwordValid: "",
      role: 2,
      termAndConditions: false,
    },

    validationSchema: Yup.object({
      fullName: Yup.string()
        .max(40, 'El nombre no debe contener mas de 14 carácteres')
        .matches(/[A-Za-z ]+/, 'No se amdmiten numeros')
        .required('Este campo es requerido'),
      // documentType: Yup.string()
      //   .required('Este campo es requerido'),
      // documentNumber: Yup.string()
      //   .required('Este campo es requerido')
      //   .max(10, 'El número de documentNumber no debe contener mas de 10 dígitos'),
      // direccion: Yup.string()
      //     .max(14, 'la dirección no debe contener mas de 14 carácteres')
      //     .required('Este campo es requerido'),
      // indicative: Yup.string()
      //     .required('Este campo es requerido'),
      phone: Yup.number()
        .required('Este campo es requerido')
        .positive('El número de phone debe de contener numeros mayores a 0'),
      // direccion: Yup.string()
      //     .max(30, 'dirección no debe contener mas de 14 carácteres')
      //     .required('Este campo es requerido'),
      email: Yup.string()
        .max(30, 'El email no debe contener mas de 14 carácteres')
        .matches(mailformat, 'Dirección de email invalida')
        .required('Este campo es requerido'),
      // // fechaNacimiento: Yup.date()
      //     .required('La fecha es requerida')
      //     .nullable(true)
      //     .default(undefined)
      //     .typeError('Invalid Date')
      password: Yup.string().required("La contraseña es requeria"),
      passwordValid: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Las contraseñas son invalidas"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await register(values);
        navigate('/session/signin');
        setLoading(false);
      } catch (e) {
        console.log('Error register : ', e);
        setLoading(false);
      }
    }
  })

  const options = [
    {
      label: "label 1",
      value: "value 1",
      dialCode: "dialCode 1"
    },
    {
      label: "label 2",
      value: "value 2",
      dialCode: "dialCode 2"
    }
  ];

  const { Option } = components;
  const [selected, setSelected] = useState(options[0]);
  const IconOption = (props) => {
    const { label, dialCode } = props.data;

    return (
      <Option {...props}>
        <div>{label}</div>
        <div>{`(+${dialCode})`}</div>
      </Option>
    );
  };

  const onSelectedChange = (
    newValue
  ) => {
    setSelected(newValue);
  };

  useEffect(async () => {
    let data
    let contries = await getCountries()
    if (contries.length > 0) {
      data = contries.map(el => {
        return {
          value: el.id,
          // label: renderHTML(el.ESPANOL, el.PHONE_CODE)
          label: el.ESPANOL + ' (+' + el.PHONE_CODE + ')'
        };
      })
    }
    setOptionsCountries(data)
  }, []);

  const handeloChangeCoutryIndicative = (value) => {
    setValueCountry(value)
    registerFormik.setFieldValue('indicative', value)
    console.log(registerFormik.errors.indicative);
  }

  const onBlurIndacative = (e) => {
    registerFormik.touched.indicative = true
  }

  const stylesSelect = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.3)',
      background: 'transparent',
      fontSize: '15px',
      cursor: 'pointer',
      display: 'flex',
    }),
    container: (baseStyles) => ({
      ...baseStyles,
      background: 'transparent'
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      color: 'white'
    }),
    option: (baseStyles) => ({
      ...baseStyles,
      cursor: 'pointer'
    }),
    singleValue: (baseStyles) => ({
      ...baseStyles,
      color: 'white'
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      background: '#191A43',
      color: 'white',
    }),
    valueContainer: (baseStyles, state) => ({
      ...baseStyles,
      // height: '30px',
      marginTop: -1
    }),
  }

  const themeSelect = (theme) => ({
    ...theme,
    borderRadius: 5,
    colors: {
      ...theme.colors,
      primary25: '#b2b6d4',
      primary: '#111128',
    },
  })
  return (
    <Grid className='ppal-register'>
      <Grid className='logo-login container'>
        <a href='https://www.1trader.online' >
          <MatxLogo />
        </a>
      </Grid>
      <Card className="card form-register">
        <Grid container justify='center' >
          <Grid item md={12} sm={12} xs={12} >
            <Form className='form-group'>
              <FormGroup >
                <Label for="fullName" className='labels'>Nombre completo</Label>
                <Input
                  type="text"
                  name="fullName"
                  id="nombre"
                  placeholder="Ingrese su nombre completo"
                  onChange={registerFormik.handleChange}
                  onBlur={registerFormik.handleBlur}
                  value={registerFormik.values.fullName}
                  className='inputLogin'
                />
                {registerFormik.touched.fullName && registerFormik.errors.fullName && <div className="bg-red-500 border-l-4">
                  <p style={{ color: 'white', padding: 3 }}>{registerFormik.touched.fullName && registerFormik.errors.fullName}</p>
                </div>}
              </FormGroup>
            </Form>
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Form className='form-group'>
              <FormGroup  >
                <Label for="email" className='labels'>E-mail</Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Ingrese la dirección de email"
                  onChange={registerFormik.handleChange}
                  onBlur={registerFormik.handleBlur}
                  value={registerFormik.values.email}
                  className='inputLogin'
                />
                {registerFormik.touched.email && registerFormik.errors.email && <div className="bg-red-500 border-l-4">
                  <p style={{ color: 'white', padding: 3 }}>{registerFormik.touched.email && registerFormik.errors.email}</p>
                </div>}
              </FormGroup>
            </Form>
          </Grid>
          <Grid container item md={12} sm={12} xs={12} spacing={2}>
            <Grid item md={6} sm={12} xs={12}>
              <Form className='form-group z-index-select'>
                <FormGroup >
                  <Label for="indicative" className='labels mb-3'>Indicativo</Label>
                  <SelectComponent
                    optionsValues={optionsCountries}
                    valueOp={registerFormik.values.indicative}
                    handle={handeloChangeCoutryIndicative}
                    onBlurFn={onBlurIndacative}
                    placeHolder='Ejemp México(+52)'
                    name='indicative'
                    calssNameSelect={'mt-1'}
                    styles={stylesSelect}
                    theme={themeSelect}
                  />
                  <div className="bg-red-100 border-l-4">
                    <p style={{ color: 'black', padding: 3 }} className="mb-0">
                      {registerFormik.touched.indicative && registerFormik.errors.indicative}
                    </p>
                  </div>
                </FormGroup>
              </Form>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <Form className='form-group'>
                <FormGroup >
                  <Label for="phone" className='labels'>Teléfono</Label>
                  <NumberFormat
                    customInput={Input}
                    isNumericString={true}
                    id="phone"
                    placeholder="+52 954 741 0505"
                    onChange={(e) => registerFormik.setFieldValue("phone", e.target.value)}
                    onBlur={registerFormik.handleBlur}
                    value={registerFormik.values.phone}
                    className='inputLogin'
                  />
                  {registerFormik.touched.phone && registerFormik.errors.phone && <div className="bg-red-500 border-l-4">
                    <p style={{ color: 'white', padding: 3 }}>{registerFormik.touched.phone && registerFormik.errors.phone}</p>
                  </div>}
                </FormGroup>
              </Form>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} sm={12} xs={12}>
              <Form className='form-group'>
                <FormGroup >
                  <Label for="password" className='labels'>Ingrese la contraseña</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Ingrese la contraseña"
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    value={registerFormik.values.password}
                    className='inputLogin'
                  />
                  {registerFormik.touched.password &&
                    registerFormik.errors.password && (
                      <div className="bg-red-500 border-l-4">
                        <p style={{ color: "white", padding: 3 }}>
                          {registerFormik.touched.password &&
                            registerFormik.errors.password}
                        </p>
                      </div>
                    )}
                </FormGroup>
              </Form>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <Form className='form-group'>
                <FormGroup >
                  <Label for="PasswordValid" className='labels'>Confirmar Contraseña</Label>
                  <Input
                    type="password"
                    name="passwordValid"
                    id="passwordValid"
                    placeholder="Confirme la contraseña"
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    value={registerFormik.values.passwordValid}
                    className='inputLogin'
                  />
                  {registerFormik.touched.passwordValid &&
                    registerFormik.errors.passwordValid && (
                      <div className="bg-red-500 border-l-4">
                        <p style={{ color: "white", padding: 3 }}>
                          {registerFormik.touched.passwordValid &&
                            registerFormik.errors.passwordValid}
                        </p>
                      </div>)}
                </FormGroup>
              </Form>
            </Grid>
          </Grid>
          <Grid item md={4} sm={12} xs={12} display={'flex'}>
            <Input
              type="checkbox"
              style={{ cursor: 'pointer' }}
              value={registerFormik.values.termAndConditions}
              onChange={(e) => registerFormik.setFieldValue('termAndConditions', e.target.checked)}
            />
            <Typography
              display={'flex'}
              color={'white'}
              marginLeft={1}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                toggleModalTermAndConditions()
              }}
            >
              Terminos y condiciones
            </Typography>
          </Grid>
          <Grid style={{ marginTop: '30px' }} item md={12} sm={12} xs={12}>
            <Grid className='centrar'>
              <LoadingButton
                type="submit"
                size='small'
                color="primary"
                loading={loading}
                variant="contained"
                sx={{ my: 1 }}
                style={{ cursor: 'pointer', background: '#ecab0f' }}
                disabled={!registerFormik.values.termAndConditions ? true : false}
                onClick={registerFormik.handleSubmit}
              >
                Registrar
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Card >
      <TermAndConditions open={modalTermAndConditions} />
    </Grid >
  );
};

export default JwtRegister;
