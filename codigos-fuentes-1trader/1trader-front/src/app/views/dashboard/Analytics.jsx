import { useEffect } from 'react';
import { useState } from 'react';
import { Card, Grid, Typography, styled, useTheme } from '@mui/material';
import { Fragment } from 'react';
import Campaigns from './shared/Campaigns';
import DoughnutChart from './shared/Doughnut';
import RowCards from './shared/RowCards';
import StatCards from './shared/StatCards';
import StatCards2 from './shared/StatCards2';
import TopSellingTable from './shared/TopSellingTable';
import UpgradeCard from './shared/UpgradeCard';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import useAuth from 'app/hooks/useAuth';
import Select from "react-select";
import _ from 'lodash'
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendDown, faArrowTrendUp, faCaretDown, faCaretUp, faHandHoldingDollar, faRotate } from '@fortawesome/free-solid-svg-icons'

// Slices
import { getUserById, updateUser, updateFinishRegister } from 'app/slices/userSlice/users';

import { ModalUtils } from 'app/components/Modal/ModalUtil';
import { ERRORNETWORK, MAILFORMAT } from '../../utils/constant'
import ButtonAction from 'app/components/Button/ButtonAction';
import { Message } from 'app/components/Notification/Notification';
import { formatPrice, validateEmail } from 'app/utils/utils';
import SelectComponent from 'app/components/select/SelectComponent';
import { getCountries, getFinancialActive } from 'app/services/utils.services';
import { initiateSocket } from 'app/services/socket';
import DataTable from 'app/components/DataTable/DataTable';

const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginRight: '.5rem',
  textTransform: 'capitalize',
}));

const SubTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const H4 = styled('h4')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginBottom: '16px',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
}));

const Analytics = () => {

  const { palette } = useTheme();

  const { user } = useAuth();

  // HOOKS
  const [modalPerfil, setModalPerfil] = useState(false)

  const [documentType, setDocumentType] = useState([
    { id: '1', documentType: 'DNI' },
    { id: '2', documentType: 'CE' },
    { id: '3', documentType: 'PASAPORTE' },
    { id: '4', documentType: 'INE' },
    { id: '5', documentType: 'DUI' },
  ])
  let optionsDocumentType = documentType.map((el, index) => {
    return {
      value: el.id,
      label: el.documentType,
    };
  });

  const [dataGoole, setDataGoogle] = useState([]);
  const [googleDataFilter, SetGoogleDataFilter] = useState([]);
  const [classSelectEEUU, setClassSelecteEEUU] = useState(false);
  const [classSelectEuropa, setClassSelecteEuropa] = useState(false);
  const [classSelectAsia, setClassSelecteAsia] = useState(false);
  const [classSelectDivisas, setClassSelecteDivisas] = useState(false);
  const [classSelectCriptoMoneda, setClassSelecteCriptoMoneda] = useState(false);
  const [dataActivesPayment, setDataActivesPayment] = useState({ clientId: '', actives: [] });
  const [classSelecFuturos, setClassSelecFuturos] = useState(false);
  const [flagPayment, setFlagPayment] = useState(false);
  const [dataActives, setDataActives] = useState([]);
  const [valueCountry, setValueCountry] = useState(null);
  const [optionsCountries, setOptionsCountries] = useState([]);

  const [spinner, setSpinner] = useState(false)

  const dispatch = useDispatch();
  const { users } = useSelector(state => state.users);
  let dataUser = users.filter(u => u.id == user.id)
  let sumActives = 0
  let cantPayments = 0
  let activesEarning = 0
  let activesLose = 0

  let { earningPayments } = useSelector((state) => state.earningPayments)
  earningPayments = earningPayments
    .filter((earn) => parseInt(earn.id) == parseInt(user.id))[0]?.account_?.payments.map((pays) => {
      sumActives = sumActives + pays.total
      if (pays.status === 1) {
        activesEarning += pays.total
      } else if (pays.status === 2) {
        activesLose += pays.total
      }
      cantPayments++
      return {
        title: pays.title,
        price: pays.price,
        price_movement: {
          percentage: pays.percentage,
          value: pays.value,
          movement: pays.movement,
        },
        payment: {
          investmentValue: pays.investmentValue,
          date: pays.date,
          hour: pays.hour,
          result: pays.result,
          total: pays.total,
          status: pays.status === 1 ? true : false,
        },
      };
    });

  const userFormik = useFormik({
    initialValues: {
      id: '',
      idUser: '',
      fullName: '',
      documentType: '',
      documentNumber: '',
      email: '',
      indicative: '',
      phone: '',
      postalCode: '',
      avatar: '',
      finishRegister: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .max(40, 'El nombre no debe contener mas de 14 carácteres')
        .matches(/[A-Za-z ]+/, 'No se amdmiten numeros')
        .required('Este campo es requerido'),
      email: Yup.string()
        .max(30, 'El email no debe contener mas de 14 carácteres')
        .matches(MAILFORMAT, 'Dirección de email invalida')
        .required('Este campo es requerido')
        .test(
          "Unique Email",
          "Este correo esta en uso", // <- key, message
          async function (value) {
            return new Promise((resolve, reject) => {
              return new Promise((resolve, reject) => {
                validateEmail(value, user.id)
                  .then(resp => {
                    if (resp) {
                      resolve(true)
                    }
                    resolve(false)
                  }).catch((e => resolve(false)))
              });
            });
          }
        ),
      // indicative: Yup.string()
      //     .required('Este campo es requerido'),
      phone: Yup.number()
        .required('Este campo es requerido')
        .positive('El número de phone debe de contener numeros mayores a 0'),
    }),
    onSubmit: () => {
      // console.log('Mostrando datos: ');
    }
  })

  useEffect(() => {
    dispatch(getUserById(user.id))
  }, []);

  useEffect(async () => {
    let data
    let contries = await getCountries()
    if (contries.length > 0) {
      data = contries.map(el => {
        return {
          value: el.id,
          // label: renderHTML(el.ESPANOL, el.PHONE_CODE)
          label: el.ESPANOL + ' +' + el.PHONE_CODE
        };
      })
    }
    setOptionsCountries(data)
  }, []);

  useEffect(async () => {
    let data = await getFinancialActive();
    if (Object.keys(data).length > 0) {
      setDataGoogle(data);
      SetGoogleDataFilter(data.markets.us);
      setClass('EE.UU');
    }
  }, []);

  useEffect(async () => {
    if (users.length > 0 && users[0].finishRegister !== true && users[0].role == 'User') {
      initChargerData()
      setModalPerfil(false)
    }

  }, [users]);

  function initChargerData() {
    userFormik.setFieldValue('id', users[0].id)
    userFormik.setFieldValue('idUser', users[0].idUser)
    userFormik.setFieldValue('fullName', users[0].fullName)
    userFormik.setFieldValue('email', users[0].email)
    userFormik.setFieldValue('indicative', users[0].indicative)
    userFormik.setFieldValue('phone', users[0].phone)
    userFormik.setFieldValue('finishRegister', users[0].finishRegister)
    userFormik.setFieldValue('termAndConditions', users[0].termAndConditions)
    if (users[0].finishRegister == false) {
      setTimeout(() => { toggleModalPerfil() }, 2000)
    }
  }

  const toggleModalPerfil = () => {
    setModalPerfil(!modalPerfil)
    //limpiarCampos()
  };

  const closeModalPerfil = async () => {
    setModalPerfil(false)
  }

  const onChangeDocumentType = (value) => {
    // let docType = _.find(documentType, (docType => docType.id == value))
    userFormik.setFieldValue('documentType', value)
  }

  const cancelFinisRegister = async () => {
    try {
      dispatch(updateFinishRegister(userFormik.values.id, (error) => {
        if (error !== null && !error) {
          userFormik.resetForm()
          toggleModalPerfil()
          setSpinner(false)
        }
        else if (error.message === ERRORNETWORK) {
          Message('error', 'Depósito', 'Lo sentimos el sistema no esta diponible en estos momentos.')
          userFormik.resetForm()
          toggleModalPerfil()
          setSpinner(false)
        }
        else {
          Message('error', 'Depósito', 'No sa ha podido relizar operación.')
          userFormik.resetForm()
          toggleModalPerfil()
          setSpinner(false)
        }
      }))
    } catch (error) {
      console.log(error);
    }
  }

  const handeloChangeCoutryIndicative = (value) => {
    setValueCountry(value)
    userFormik.setFieldValue('indicative', value)
  }

  const onBlurIndacative = (e) => {
    userFormik.touched.indicative = true
  }

  const uptateUser = () => {
    userFormik.values.finishRegister = true
    if (!userFormik.values.documentType || userFormik.values.documentType === '') {
      userFormik.values.documentType = null
    }
    let data = {
      user: {
        ...userFormik.values
      },
    }
    if (userFormik.isValid) {
      setSpinner(true)
      dispatch(updateUser(user.id, data, (error) => {
        if (error !== null && !error) {
          Message('success', 'Actuaización datos', 'Datos actualizados correctamente.')
          userFormik.resetForm()
          toggleModalPerfil()
          setSpinner(false)
        }
        else if (error.message === ERRORNETWORK) {
          Message('error', 'Actuaización datos', 'Lo sentimos el sistema no esta diponible en estos momentos.')
          userFormik.resetForm()
          toggleModalPerfil()
          setSpinner(false)
        }
        else {
          Message('error', 'Actuaización datos', 'No sa ha podido relizar esta operación.')
          userFormik.resetForm()
          toggleModalPerfil()
          setSpinner(false)
        }
      }))
    }
  }

  const stylesSelect = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? 'solid #ced4da' : 'solid #ced4da',
      border: !state.isFocused ? 'solid #ced4da' : 'solid #ced4da',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '14px'
    }),
    option: (baseStyles) => ({
      ...baseStyles,
      cursor: 'pointer'
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      color: 'black',
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      minHeight: '90px'
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

  // const filterInversion = (type) => {
  //   switch (type) {
  //     case 'EE.UU':
  //       setClass(type);
  //       dataGoole.length > 0 && SetGoogleDataFilter(dataGoole.markets.us);
  //       break;
  //     case 'EU':
  //       dataGoole.length > 0 && SetGoogleDataFilter(dataGoole.markets.europe);
  //       setClass(type);
  //       break;
  //     case 'AS':
  //       dataGoole.length > 0 && SetGoogleDataFilter(dataGoole.markets.asia);
  //       setClass(type);
  //       break;
  //     case 'DIV':
  //       dataGoole.length > 0 && SetGoogleDataFilter(dataGoole.markets.currencies);
  //       setClass(type);
  //       break;
  //     case 'CRIP':
  //       dataGoole.length > 0 && SetGoogleDataFilter(dataGoole.markets.crypto);
  //       setClass(type);
  //       break;
  //     case 'FUT':
  //       dataGoole.length > 0 && SetGoogleDataFilter(dataGoole.markets.futures);
  //       setClass(type);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const filterInversion = (type) => {
    switch (type) {
      case 'EE.UU':
        setClass(type);
        SetGoogleDataFilter(dataGoole.markets.us);
        break;
      case 'EU':
        SetGoogleDataFilter(dataGoole.markets.europe);
        setClass(type);
        break;
      case 'AS':
        SetGoogleDataFilter(dataGoole.markets.asia);
        setClass(type);
        break;
      case 'DIV':
        SetGoogleDataFilter(dataGoole.markets.currencies);
        setClass(type);
        break;
      case 'CRIP':
        SetGoogleDataFilter(dataGoole.markets.crypto);
        setClass(type);
        break;
      case 'FUT':
        SetGoogleDataFilter(dataGoole.markets.futures);
        setClass(type);
        break;
      default:
        break;
    }
  };

  const setClass = (type) => {
    switch (type) {
      case 'EE.UU':
        setClassSelecteEEUU(true);
        setClassSelecteEuropa(false);
        setClassSelecteAsia(false);
        setClassSelecteDivisas(false);
        setClassSelecteCriptoMoneda(false);
        setClassSelecFuturos(false);
        break;
      case 'EU':
        setClassSelecteEEUU(false);
        setClassSelecteEuropa(true);
        setClassSelecteAsia(false);
        setClassSelecteDivisas(false);
        setClassSelecteCriptoMoneda(false);
        setClassSelecFuturos(false);
        break;
      case 'AS':
        setClassSelecteEEUU(false);
        setClassSelecteEuropa(false);
        setClassSelecteAsia(true);
        setClassSelecteDivisas(false);
        setClassSelecteCriptoMoneda(false);
        setClassSelecFuturos(false);
        break;
      case 'DIV':
        setClassSelecteEEUU(false);
        setClassSelecteEuropa(false);
        setClassSelecteAsia(false);
        setClassSelecteDivisas(true);
        setClassSelecteCriptoMoneda(false);
        setClassSelecFuturos(false);
        break;
      case 'CRIP':
        setClassSelecteEEUU(false);
        setClassSelecteEuropa(false);
        setClassSelecteAsia(false);
        setClassSelecteDivisas(false);
        setClassSelecteCriptoMoneda(true);
        setClassSelecFuturos(false);
        break;
      case 'FUT':
        setClassSelecteEEUU(false);
        setClassSelecteEuropa(false);
        setClassSelecteAsia(false);
        setClassSelecteDivisas(false);
        setClassSelecteCriptoMoneda(false);
        setClassSelecFuturos(true);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: 'Nombre Empresa',
      field: 'title',
      cellStyle: {
        fontSize: 13,
        textAlign: 'center',
      },
      headerStyle: {
        alignItems: 'center',
        fontSize: 13,
        textAlign: 'center',
      },
    },
    {
      title: 'Precio',
      render: (rowData) => renderActiveDataPayment(rowData),
      cellStyle: {
        fontSize: 13,
      },
      headerStyle: {
        alignItems: 'left',
        fontSize: 13,
        textAlign: 'left',
      },
    },
    {
      title: 'V. Invertido (€)',
      field: 'payment.investmentValue',
      // render: (rowData) => renderEarninOperation(rowData),
      type: 'currency',
      currencySetting: {
        currenctCode: 'us',
        minimumFractionDigits: 0,
      },
      cellStyle: {
        textAlign: 'center',
        fontSize: 13,
        width: 20,
      },
      headerStyle: {
        textAlign: 'center',
      },
    },
    {
      title: 'Fecha',
      field: 'payment.date',
      cellStyle: {
        fontSize: 13,
        textAlign: 'center',
        width: '20px',
      },
      headerStyle: {
        alignItems: 'center',
        fontSize: 13,
        textAlign: 'center',
        width: '20px',
      },
    },
    {
      title: 'Hora',
      field: 'payment.hour',
      cellStyle: {
        fontSize: 13,
        textAlign: 'center',
        width: '20px',
      },
      headerStyle: {
        alignItems: 'center',
        fontSize: 13,
        textAlign: 'center',
        width: '20px',
      },
    },
    {
      title: 'Resultado',
      field: 'payment.result',
      render: (rowData) => renderEarningEarningActive(rowData),
      cellStyle: {
        textAlign: 'center',
        fontSize: 13,
        width: 20,
      },
      headerStyle: {
        textAlign: 'center',
      },
    },
    {
      title: 'Total',
      field: 'payment.total',
      render: (rowData) => renderEarningOperation(rowData),
      cellStyle: {
        textAlign: 'center',
        fontSize: 13,
        width: 20,
      },
      headerStyle: {
        textAlign: 'center',
      },
    },
  ];

  const renderActiveDataPayment = (row) => {
    return (
      <Grid
        md={12}
        sm={12}
        xs={12}
        className={`content-inversion-payment cursor-pointer`}
        style={{ cursor: 'pointer' }}
      >
        <Grid md={12} sm={12} xs={12} container className="icon-up">
          <Grid sm={12} xs={12}>
            <span style={{ fontSize: '12px', marginLeft: '5px' }}>{row?.price} </span>
          </Grid>
          <Grid
            item
            className={`${row?.price_movement?.movement === 'Up'
              ? 'icon-up-card-payment'
              : 'icon-down-card-payment'
              }`}
          >
            {row?.price_movement.movement === 'Up' ? (
              <Grid md={12} sm={12} xs={12} className="style-card-payment-Table">
                <FontAwesomeIcon
                  style={{ margin: '0 auto', marginRight: '4px', fontSize: '12px' }}
                  icon={faCaretUp}
                />
                +
                <span style={{ fontSize: '11px', marginLeft: '5px', fontWeight: 'bold' }}>
                  {` ${row?.price_movement.value}`}
                </span>
                <span style={{ fontSize: '11px', marginLeft: '5px', fontWeight: 'bold' }}>
                  {` ${row?.price_movement.percentage} `}
                </span>
                (%)
              </Grid>
            ) : (
              <Grid md={12} sm={12} xs={12} className="style-card-payment-Table">
                <FontAwesomeIcon
                  style={{ margin: '0 auto', marginRight: '4px', fontSize: '12px' }}
                  icon={faCaretDown}
                />
                <span style={{ fontSize: '11px', marginLeft: '5px', fontWeight: 'bold' }}>
                  {` ${row?.price_movement.value}`}
                </span>
                <span style={{ fontSize: '11px', marginLeft: '5px', fontWeight: 'bold' }}>
                  {` ${row?.price_movement.percentage} `}
                </span>
                (%)
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderEarningOperation = (rowData) => {
    if (rowData.payment.status === true) {
      return (
        <Grid className="container">
          <Grid>
            <span style={{ color: 'green', fontWeight: 'bold' }} class="material-icons">
              moving
              <span
                style={{ color: 'green', fontWeight: 'bold', fontSize: '12px' }}
                class="material-icons"
              >
                {' '}
                add
              </span>
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '15px', color: 'rgb(236, 171, 15)' }}>
              {formatPrice(rowData.payment.total)}{' '}
            </span>
          </Grid>
        </Grid>
      );
    } else if (rowData.payment.status === false) {
      return (
        <Grid className="container">
          <Grid>
            <span style={{ color: 'red', fontWeight: 'bold' }} class="material-icons">
              <span class="material-icons">trending_down</span>
              <span
                style={{ color: 'red', fontWeight: 'bold', fontSize: '12px' }}
                class="material-icons"
              >
                {' '}
                remove
              </span>
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '15px', color: 'red' }}>
              {formatPrice(rowData.payment.total)}{' '}
            </span>
          </Grid>
        </Grid>
      );
    }
  };

  const renderEarningEarningActive = (rowData) => {
    if (rowData.payment.status === true) {
      return (
        <Grid className="container">
          <Grid>
            <span style={{ color: 'green', fontWeight: 'bold' }} class="material-icons">
              moving
              <span
                style={{ color: 'green', fontWeight: 'bold', fontSize: '12px' }}
                class="material-icons"
              >
                {' '}
                add
              </span>
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '15px', color: 'rgb(236, 171, 15)' }}>
              {formatPrice(rowData.payment.result)}{' '}
            </span>
          </Grid>
        </Grid>
      );
    } else if (rowData.payment.status === false) {
      return (
        <Grid className="container">
          <Grid>
            <span style={{ color: 'red', fontWeight: 'bold' }} class="material-icons">
              <span class="material-icons">trending_down</span>
              <span
                style={{ color: 'red', fontWeight: 'bold', fontSize: '12px' }}
                class="material-icons"
              >
                {' '}
                remove
              </span>
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '15px', color: 'red' }}>
              {formatPrice(rowData.payment.result)}{' '}
            </span>
          </Grid>
        </Grid>
      );
    }
  };

  const data = () => {
    if (flagPayment) {
      return dataActivesPayment?.actives;
    } else {
      if (earningPayments) {
        if (earningPayments[0] !== undefined || earningPayments?.length > 0) {
          return earningPayments !== undefined ? JSON.parse(JSON.stringify(earningPayments)) : [];
        }
      }
    }
  };

  return (
    <Fragment>
      <Grid className='container'>
        <Grid md={12} className=" markets-ppal mt-4">
          <Grid className="markets-title">
            <Typography className="title2">Mercados</Typography>
          </Grid>
          <div
            item
            md={12}
            className={`  markets-invest ${classSelectEEUU ? 'markets-invest-select' : false}`}
            onClick={() => filterInversion('EE.UU')}
          >
            <Grid className="markets-ee-uu">
              <Typography className="">EE.UU.</Typography>
            </Grid>
          </div>
          <div
            item
            md={12}
            className={`markets-invest ${classSelectEuropa ? 'markets-invest-select' : false} `}
            onClick={() => filterInversion('EU')}
          >
            <Grid className="markets-ee-uu">
              <Typography className="">Europa.</Typography>
            </Grid>
          </div>
          <div
            item
            md={12}
            className={`markets-invest ${classSelectAsia ? 'markets-invest-select' : false}`}
            onClick={() => filterInversion('AS')}
          >
            <Grid className="markets-ee-uu">
              <Typography className="">Asia</Typography>
            </Grid>
          </div>
          <Grid
            item
            md={12}
            className={`markets-invest ${classSelectDivisas ? 'markets-invest-select' : false}`}
            onClick={() => filterInversion('DIV')}
          >
            <Grid className="markets-ee-uu">
              <Typography className="">Divisas</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            md={12}
            className={`markets-invest ${classSelectCriptoMoneda ? 'markets-invest-select' : false
              }`}
            onClick={() => filterInversion('CRIP')}
          >
            <Grid className="markets-ee-uu">
              <Typography className="">Criptomoneda</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            md={12}
            className={`markets-invest ${classSelecFuturos ? 'markets-invest-select' : false}`}
            onClick={() => filterInversion('FUT')}
          >
            <Grid className="markets-ee-uu">
              <Typography className="">Futuros</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <div className="container ppal-div-markets"> */}
      <Grid item container md={12} sm={6} xs={12}>
        {googleDataFilter &&
          googleDataFilter.map((el) => {
            const nf = new Intl.NumberFormat('en-US');
            return (
              <Grid md={2} sm={6} xs={12} className={`container content-inversion`}>
                <Grid container className="icon-up">
                  <Grid
                    item
                    className={`${el.price_movement.movement === 'Up' ? 'icon-up-card' : 'icon-down-card'
                      }`}
                  >
                    {el.price_movement.movement === 'Up' ? (
                      <span class="material-icons" style={{ margin: '0 auto' }}>
                        arrow_upward
                      </span>
                    ) : (
                      <span class="material-icons" style={{ margin: '0 auto' }}>
                        arrow_downward
                      </span>
                    )}
                  </Grid>
                </Grid>
                <Grid className={`conatiner-1`}>
                  <Grid className={`conatiner-2`}>
                    <Grid sm={12} xs={12}>
                      <Grid sm={12} xs={12}>
                        <Typography
                          style={{ fontSize: '0.6rem', fontFamily: 'Roboto,Arial,sans-serif;' }}
                        >
                          {el.name}
                        </Typography>
                      </Grid>{' '}
                      <Grid sm={12} xs={12}>
                        <span style={{ fontSize: '0.6rem' }}>{nf.format(el.price)} </span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid className={`conatiner-3`}>
                    <Grid sm={12} xs={12}>
                      <Grid sm={12} xs={12}>
                        {el.price_movement.movement === 'Up' ? (
                          <Typography
                            className="moven-up"
                            style={{ fontSize: '0.6rem', fontWeight: 'bold' }}
                          >
                            + {Number.parseFloat(el.price_movement.percentage).toFixed(2)} %
                          </Typography>
                        ) : (
                          <Typography
                            className="moven-down"
                            style={{ fontSize: '0.6rem', fontWeight: 'bold', marginLeft: '6px' }}
                          >
                            - {Number.parseFloat(el.price_movement.percentage).toFixed(2)} %
                          </Typography>
                        )}
                      </Grid>{' '}
                      <Grid sm={12} xs={12}>
                        {el.price_movement.movement === 'Up' ? (
                          <span
                            className="moven-up"
                            style={{ fontSize: '0.6rem', fontWeight: 'bold' }}
                          >
                            + {Number.parseFloat(el.price_movement.value).toFixed(2)}{' '}
                          </span>
                        ) : (
                          <span
                            className="moven-down"
                            style={{ fontSize: '0.6rem', fontWeight: 'bold', marginLeft: '6px' }}
                          >
                            - {Number.parseFloat(el.price_movement.value).toFixed(2)}
                          </span>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
      </Grid>
      {/* </div> */}
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            {/* <StatCards /> */}
            {/* <TopSellingTable /> */}
            <StatCards2 account={dataUser[0]?.account_?.balance} acticves={sumActives} />

            {/* <H4>Ongoing Projects</H4>
            <RowCards /> */}
            <Grid className="mb-2" style={{ overflow: 'auto' }}>
              <table class="table responsive">
                <thead class="table-light">
                  <th>Activo</th>
                  <th>Precio</th>
                  <th>V.Invertido(€)</th>
                  <th>Resultado</th>
                  <th>Total</th>
                </thead>
                <tbody>
                  {
                    data()?.map(el => {
                      // console.log(el, data());
                      return (
                        <tr>
                          <td>{el.title}</td>
                          <td>
                            <small className="custom-small price-analytic">
                              <FontAwesomeIcon
                                style={{ marginRight: '2px', color: '#fff' }}
                                icon={faHandHoldingDollar}
                              />
                              {el.price}
                            </small>
                          </td>
                          <td>
                            <small className="custom-small ">
                              <FontAwesomeIcon
                                style={{ marginRight: '2px', color: '#fff' }}
                                icon={faHandHoldingDollar}
                              />
                              {el.payment.investmentValue} €
                            </small>
                          </td>
                          <td>
                            <small
                              className={`${el?.payment?.status == true ? 'custom-small-home' : 'custom-small-faild'
                                } `}
                            >
                              <FontAwesomeIcon
                                style={{ marginRight: '2px', color: '#fff' }}
                                icon={el?.payment?.status ? faArrowTrendUp : faArrowTrendDown}
                              />
                              {el?.payment?.result}
                            </small>
                          </td>
                          <td>
                            <small className="custom-small  price-analytic">
                              <FontAwesomeIcon
                                style={{ marginRight: '2px', color: '#fff' }}
                                icon={faHandHoldingDollar}
                              />
                              {el?.payment?.total}
                            </small>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </Grid>
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Card sx={{ px: 7, py: 4, mb: 3 }}>
              <Title>Estadistica Activos</Title>
              <SubTitle>ultimos dias</SubTitle>
              <DoughnutChart
                height="300px"
                color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
                operations={cantPayments}
                activesEarning={activesEarning}
                activesLose={activesLose}
              />
            </Card>

            {/* <UpgradeCard />
            <Campaigns /> */}
          </Grid>
        </Grid>
      </ContentBox>
      <ModalUtils
        open={modalPerfil}
        title={'Finalizar Registro'}
        toggle={closeModalPerfil}
        handleChange={closeModalPerfil}
        w100Modal={"w100Modal"}
        spinner={spinner}
      >
        <Grid item md={4} sm={2} xs={12} >
          <Form >
            <FormGroup>
              <Label for="idUser">ID</Label>
              <Input
                type="text"
                name="idUser"
                onChange={userFormik.handleChange}
                onBlur={userFormik.handleBlur}
                value={userFormik.values.idUser}
                disabled={true}
                className='inputGlobal'
              />
              <div className="bg-red-100 border-l-4">
                <p >{userFormik.touched.idUser && userFormik.errors.idUser}</p>
              </div>
            </FormGroup>
          </Form>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={6} sm={12} xs={12}>
            <Form className='form-group'>
              <FormGroup>
                <Label for="fullName">Nombre completo</Label>
                <Input
                  type="text"
                  name="fullName"
                  id="nombre"
                  placeholder="Ingrese su nombre completo"
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                  value={userFormik.values.fullName}
                  className='inputGlobal'
                />
                {userFormik.touched.fullName && userFormik.errors.fullName && <div className="bg-red-500 border-l-4">
                  <p style={{ color: 'black' }}>{userFormik.touched.fullName && userFormik.errors.fullName}</p>
                </div>}
              </FormGroup>
            </Form>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Form className='form-group'>
              <FormGroup>
                <Label for="postalCode" >Còdigo postal</Label>
                <Input
                  type="text"
                  name="postalCode"
                  id="nombre"
                  placeholder="Ingrese el còdigo postal"
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                  value={userFormik.values.postalCode}
                  className='inputGlobal'
                />
                {userFormik.touched.postalCode && userFormik.errors.postalCode && <div className="bg-red-500 border-l-4">
                  <p style={{ color: 'black' }}>{userFormik.touched.postalCode && userFormik.errors.postalCode}</p>
                </div>}
              </FormGroup>
            </Form>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={6} sm={12} xs={12}>
            <Form>
              <FormGroup >
                <Label for="documentType">Tipo documento</Label>
                <SelectComponent
                  optionsValues={optionsDocumentType}
                  valueOp={userFormik.values.documentType}
                  handle={onChangeDocumentType}
                  onBlurFn={onBlurIndacative}
                  placeHolder='Tipo Documento'
                  name='documentType'
                  styles={stylesSelect}
                  theme={themeSelect}
                />
                <div className="bg-red-100 border-l-4">
                  <p style={{ color: 'black' }} className="mb-0">
                    {userFormik.touched.documentType && userFormik.errors.documentType}
                  </p>
                </div>
              </FormGroup>
            </Form>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Form>
              <FormGroup className="mb-0">
                <Label for="documento">Número de documento</Label>
                <Input
                  type="text"
                  name="documentNumber"
                  placeholder="Ingrese el número de documento"
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                  value={userFormik.values.documentNumber}
                  className='inputGlobal'
                />
                <div className="bg-red-100 border-l-4">
                  <p style={{ color: 'black' }} className="mb-0">
                    {userFormik.touched.documentNumber && userFormik.errors.documentNumber}
                  </p>
                </div>
              </FormGroup>
            </Form>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={6} sm={12} xs={12}>
            <Form className='form-group'>
              <FormGroup>
                <Label for="email">E-mail</Label>
                <Input
                  type="text"
                  name="email"
                  disabled={false}
                  placeholder="Ingrese el email"
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                  value={userFormik.values.email}
                  className='inputGlobal'
                />
                {userFormik.touched.email && userFormik.errors.email && <div className="bg-red-500 border-l-4">
                  <p style={{ color: 'black', padding: 1 }}>{userFormik.touched.email && userFormik.errors.email}</p>
                </div>}
              </FormGroup>
            </Form>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item md={7} sm={12} xs={12}>
                <Form>
                  <FormGroup>
                    <Label for="bank">Indicativo</Label>
                    <SelectComponent
                      optionsValues={optionsCountries}
                      valueOp={userFormik.values.indicative}
                      handle={handeloChangeCoutryIndicative}
                      onBlurFn={onBlurIndacative}
                      placeHolder='Indicativo'
                      name='indicative'
                      styles={stylesSelect}
                      theme={themeSelect}
                    />
                    <div className="bg-red-100 border-l-4">
                      <p style={{ color: 'black', padding: 3 }} className="mb-0">
                        {userFormik.touched.indicative && userFormik.errors.indicative}
                      </p>
                    </div>
                  </FormGroup>
                </Form>
              </Grid>
              <Grid item md={5} sm={12} xs={12}>
                <Form>
                  <FormGroup className="mb-0">
                    <Label for="telefono">Teléfono</Label>
                    <NumberFormat
                      customInput={Input}
                      isNumericString={true}
                      id="telefono"
                      placeholder="Teléfono"
                      onChange={(e) =>
                        userFormik.setFieldValue("phone", e.target.value)
                      }
                      onBlur={userFormik.handleBlur}
                      value={userFormik.values.phone}
                      className='inputGlobal'
                    />
                    <div className="bg-red-100 border-l-4">
                      <p style={{ color: 'black', padding: 3 }} className="mb-0">
                        {userFormik.touched.phone && userFormik.errors.phone}
                      </p>
                    </div>
                  </FormGroup>
                </Form>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} sm={12} xs={12} className='center-button-finish-register' display={'flex'}>
          <ButtonAction
            title={'Actualizar datos'}
            classNameButon={'button-maim'}
            size={'sm'}
            handle={uptateUser}
            fontIcon={spinner && <FontAwesomeIcon icon={faRotate} spin />}
          />
          <ButtonAction
            title={'Omitir'}
            classNameButon={'button-maim'}
            size={'sm'}
            handle={cancelFinisRegister}
          />
        </Grid>
      </ModalUtils>
    </Fragment>
  );
};

export default Analytics;
