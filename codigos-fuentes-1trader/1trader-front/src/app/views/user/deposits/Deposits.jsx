import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import NumberFormat from 'react-number-format';
import { createDeposit, getDeposit } from 'app/slices/userSlice/deposits';
import Select from 'react-select';
import _ from 'lodash';
// Context User
import useAuth from 'app/hooks/useAuth';

import Loading from 'app/components/Loading/Loading';
import { Message } from 'app/components/Notification/Notification';
import { findData, formatoPrecio, formatPrice, getHour } from '../../../utils/utils';
import ButtonAction from 'app/components/Button/ButtonAction';
import { ModalUtils } from '../../../components/Modal/ModalUtil';
import DataTable from 'app/components/DataTable/DataTable';
import {
    ERROR_TRANSACTION,
    ERRORNETWORK,
    IMG_MASTERCARD,
    IMG_MASTERCARD_OLD,
    IMG_VISA,
    IMG_VISA_OLD,
    MSG_DEPOSI,
    SYSTEM_NOT_AVALIBLE,
} from 'app/utils/constant';
import LoadingConfirm from 'app/components/Loading-message-confirm/LoadingMessageConfirm';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import TermAndConditions from 'app/components/Term-conditions/TermAndConditions';

const Deposits = () => {
    const [modal, setModal] = useState(false);
    const [modalTermAndConditions, setModalTermAndConditions] = useState(false);
    const toggleModalTermAndConditions = () => {
        setModalTermAndConditions(!modalTermAndConditions);
    }
    const [modalConfirm, setModalConfirm] = useState(false);
    const [data, setNewData] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [visibilityCharging, setVisibilityCharging] = useState(false);
    const [loadingMessageDeposit, setLoadingMessageDeposit] = useState(false);
    const [messageDeposit, setMessageDeposit] = useState('');
    const [active, setActive] = useState(0);

    const { user } = useAuth();

    const [expiration, setExpiration] = useState([
        { id: '1', year: '23' },
        { id: '2', year: '24' },
        { id: '3', year: '25' },
        { id: '4', year: '26' },
        { id: '5', year: '27' },
        { id: '6', year: '28' },
        { id: '7', year: '29' },
        { id: '8', year: '30' },
        { id: '9', year: '31' },
    ]);

    const [month, setMonth] = useState([
        { id: '1', month: '01' },
        { id: '2', month: '02' },
        { id: '3', month: '03' },
        { id: '4', month: '04' },
        { id: '5', month: '05' },
        { id: '6', month: '06' },
        { id: '7', month: '07' },
        { id: '8', month: '08' },
        { id: '9', month: '09' },
        { id: '10', month: '10' },
        { id: '11', month: '11' },
        { id: '12', month: '12' },
    ]);

    let options = expiration.map((el) => {
        return {
            value: el.id,
            label: el.year,
        };
    });

    let optionsMonth = month.map((el) => {
        return {
            value: el.id,
            label: el.month,
        };
    });

    const toggle = () => {
        setModal(!modal);
    };

    const toggleModalConfirm = () => {
        setModalConfirm(!modalConfirm);
    };

    let { deposits, isLoading } = useSelector((state) => state.deposits);
    let { users } = useSelector((state) => state.users);
    const dispatch = useDispatch();
    deposits = _.filter(
        deposits,
        (depositsUser) => depositsUser?.account_idaccount == user['account_']?.idAccount
    );
    // console.log(deposits);
    const depositFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: '',
            idUser: '',
            fullName: '',
            email: '',
            cardNumber: '',
            expYear: '',
            month: '',
            ccv: '',
            amount: 250,
            termAndConditions: false,
            depositDate: null,
            description: '',
        },
        validationSchema: Yup.object({
            cardNumber: Yup.number()
                .required('Este campo es requerido')
                .positive('el número de tarjeta debe contener numeros mayores a 0'),
            amount: Yup.number()
                .required('Este campo es requerido')
                .positive('El monto debe de contener numeros mayores a 0')
                .test('superior', 'El monto mìnimo es de 250 €', function (f) {
                    const ref = Yup.ref('min');
                    // console.log('Minimo ', ref, 'max ', this.resolve(f));
                    return f >= 250;
                }),
            month: Yup.string().required('El mes es requerido'),
            expYear: Yup.string().required('El año es requerido'),
            ccv: Yup.number()
                .required('Este campo es requerido')
                .positive('El ccv de contener numeros mayores a 0'),
        }),
        onSubmit: async () => {
            if (depositFormik.isValid) {
                let values = depositFormik.values;
                let data = {
                    user: {
                        id: values.id,
                        fullName: values.fullName,
                        email: values.email,
                    },
                    deposit: {
                        depositDate: moment().format('YYYY/MM/DD'),
                        amount: values.amount,
                        state: 0,
                        ecommerce: '',
                        hour: getHour().toString()
                    },
                    cardInfo: {
                        cardNumber: values.cardNumber,
                        expYear: values.expYear,
                        month: values.month,
                        ccv: values.ccv,
                        termAndConditions: values.termAndConditions,
                    },
                };
                setNewData(data);
                toggleModalConfirm();
            }
        },
    });

    const saveDeposit = () => {
        if (Object.keys(data).length > 0 && Object.keys(data.user).length > 0) {
            setSpinner(true);
            setLoading(true);
            setLoadingMessageDeposit(true);
            setVisibilityCharging(true);
            setTimeout(() => {
                setVisibilityCharging(false);
                setMessageDeposit(MSG_DEPOSI);
            }, 6000);
            setModalConfirm(false);
            dispatch(
                createDeposit(data, (error) => {
                    if (error !== null && !error) {
                        depositFormik.resetForm();
                        setLoading(false);
                        initChargerData();
                        if (visibilityCharging == false) {
                            setTimeout(() => {
                                setLoadingMessageDeposit(false);
                                setVisibilityCharging(false);
                                setMessageDeposit('');
                            }, 30000);
                        }
                        setModal(false);
                        setSpinner(false);
                        toggleModalConfirm();
                    } else if (error.message === ERRORNETWORK) {
                        Message('error', 'Depósito', SYSTEM_NOT_AVALIBLE);
                        depositFormik.resetForm();
                        setLoadingMessageDeposit(false);
                        setModal(false);
                        setSpinner(false);
                        setLoading(false);
                    } else {
                        depositFormik.resetForm();
                        Message('error', 'Depósito', ERROR_TRANSACTION);
                        setModal(false);
                        setSpinner(false);
                        setLoading(false);
                        setLoadingMessageDeposit(false);
                        depositFormik.resetForm();
                        toggleModalConfirm();
                    }
                })
            );
        }
    };

    useEffect(() => {
        if (users.length > 0) {
            initChargerData();
        }
    }, [users]);

    const initChargerData = () => {
        if (users !== undefined) {
            if (Object.keys(users).length > 0) {
                let u = findData(users, { id: user.id });
                depositFormik.setFieldValue('id', u.id);
                depositFormik.setFieldValue('idUser', u.idUser);
                depositFormik.setFieldValue('fullName', u.fullName);
                depositFormik.setFieldValue('email', u.email);
            }
        }
    };

    const columns = [
        {
            title: 'Fecha',
            field: 'depositDate',
            cellStyle: {
                fontSize: 13,
                textAlign: 'center',
            },
            headerStyle: {
                alignItems: 'center',
                fontSize: 13,
                textAlign: 'center',
            },
            // render: (rowData) => formatoFecha(rowData.fecha)
        },
        // {
        //     title: 'Activo',
        //     fontSize: 13,
        //     field: 'ecommerce',
        //     // render: (rowData) => formatoPrecio(rowData.ecommerce),
        //     cellStyle: {
        //         textAlign: "center",
        //         fontSize: 13,
        //     },
        //     headerStyle: {
        //         textAlign: 'center'
        //     }
        // },
        {
            title: 'Depòsito (€)',
            field: 'amount',
            render: (rowData) => {
                let p = formatPrice(rowData.amount)
                return p.replace('$', '€')
            },
            cellStyle: {
                textAlign: 'center',
                fontSize: 13,
            },
            headerStyle: {
                textAlign: 'center',
            },
        },
        {
            title: 'Estado',
            field: 'state',
            render: (rowData) => validStateDeposit(rowData.state),
            cellStyle: {
                textAlign: 'center',
                fontSize: 13,
            },
            headerStyle: {
                textAlign: 'center',
            },
        },
    ];

    const validStateDeposit = (value) => {
        if (value == '0' || value == 0) {
            return (
                <Grid item sm={12} md={12} className="Grid-main-states">
                    <Grid className="pendiente">
                        <Typography style={{ fontSize: '13px' }}>En proceso</Typography>
                    </Grid>
                </Grid>
            );
        } else if (value == '1' || value == 1) {
            return (
                <Grid item sm={12} md={12} className="drid-main-states">
                    <Grid className="pagado">
                        <Typography style={{ fontSize: '13px' }}>Pagado</Typography>
                    </Grid>
                </Grid>
            );
        }
    };

    const addCalassCard = () => {
        let prueba = document.querySelector('.tarjeta');
        if (active == 0) {
            setActive(1);
            return document.getElementById('p').classList.add('active');
        }
        if (active == 1) {
            prueba.className = prueba.className.replace('active', '');
            setActive(0);
        }
    };

    const onChangeExpYear = (value) => {
        depositFormik.setFieldValue('expYear', expiration[value].year);
        console.log(expiration[value].year);
    };

    const onChangeExpMonth = (value) => {
        depositFormik.setFieldValue('month', month[value].month);
        console.log(month[value].month);
    };

    const formatValueCarNumber = () => {
        let numberCard = depositFormik.values.cardNumber
            .replace(/\s/g, '')
            .replace(/([0-9]{4})/g, '$1 ').trim()
        return depositFormik.values.cardNumber.replace(/\s/g, '').replace(/([0-9]{4})/g, '$1 ').trim()
    };

    return (
        <Grid className="container">
            <Grid item sm={12} md={4} xs={12} className="mt-2">
                <ButtonAction
                    classNameButon={'button-maim'}
                    handle={toggle}
                    title={'Depósito'}
                    size={'sm'}
                    fontIcon={<FontAwesomeIcon style={{ marginRight: '2px' }} icon={faWallet} />}
                />
            </Grid>
            <Grid className="mb-2">
                <DataTable
                    title="Depositos"
                    columns={columns}
                    newData={!isLoading ? JSON.parse(JSON.stringify(deposits ? deposits : null)) : []}
                    size={4}
                    mtToolbar={null}
                />
            </Grid>

            {/* Modal personalizado para solicitar depositos */}
            <ModalUtils
                title="Solicitud depósito"
                w100Modal={'w100Modal'}
                mtop={'9.5rem'}
                open={modal}
                toggle={toggle}
                handleChange={depositFormik.handleSubmit}
                spinner={spinner}
                disabled={!depositFormik.values.termAndConditions ? true : false}
                visivilityModalFooter={true}
            >
                <Grid container>
                    <Grid container spacing={1}>
                        <Grid item md={5} sm={12} xs={12}>
                            <Grid md={12} xs={12} textAlign={'center'}>
                                <span>Datos personales</span>
                                <hr className="hr-deposit-form" />
                            </Grid>
                            <Grid className="mt-2" item md={12} sm={2} xs={12}>
                                <Form className="col-md-5">
                                    <FormGroup>
                                        <Label for="id">ID</Label>
                                        <Input
                                            type="text"
                                            name="idUser"
                                            onChange={depositFormik.handleChange}
                                            onBlur={depositFormik.handleBlur}
                                            value={depositFormik.values.idUser}
                                            disabled={true}
                                            className="inputGlobal"
                                        />
                                        <div className="bg-red-100 border-l-4">
                                            <p className="mb-0">
                                                {depositFormik.touched.idUser && depositFormik.errors.idUser}
                                            </p>
                                        </div>
                                    </FormGroup>
                                </Form>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <Form>
                                    <FormGroup>
                                        <Label for="fullName">Nombre completo</Label>
                                        <Input
                                            type="text"
                                            name="fullName"
                                            id="nombre"
                                            placeholder="Ingrese su nombre completo"
                                            onChange={depositFormik.handleChange}
                                            onBlur={depositFormik.handleBlur}
                                            value={depositFormik.values.fullName}
                                            className="inputGlobal"
                                        />
                                        {depositFormik.touched.fullName && depositFormik.errors.fullName && (
                                            <div className="bg-red-500 border-l-4">
                                                <p style={{ color: 'white', padding: 3 }}>
                                                    {depositFormik.touched.fullName && depositFormik.errors.fullName}
                                                </p>
                                            </div>
                                        )}
                                    </FormGroup>
                                </Form>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <Form>
                                    <FormGroup>
                                        <Label for="email" className="labels">
                                            E-mail
                                        </Label>
                                        <Input
                                            type="text"
                                            name="email"
                                            id="email"
                                            disabled={true}
                                            placeholder="Ingrese la dirección de email"
                                            onChange={depositFormik.handleChange}
                                            onBlur={depositFormik.handleBlur}
                                            value={depositFormik.values.email}
                                            className="inputGlobal"
                                        />
                                        {depositFormik.touched.email && depositFormik.errors.email && (
                                            <div className="bg-red-500 border-l-4">
                                                <p style={{ color: 'white', padding: 3 }}>
                                                    {depositFormik.touched.email && depositFormik.errors.email}
                                                </p>
                                            </div>
                                        )}
                                    </FormGroup>
                                </Form>
                            </Grid>
                        </Grid>
                        <Grid item md={7} sm={12} xs={12}>
                            <Grid md={12} xs={12} textAlign={'center'}>
                                <span>Datos Tarjeta</span>
                                <hr className="hr-deposit-form" />
                            </Grid>
                            <Grid className="contenedor-card" md={12} xs={12}>
                                <section
                                    onClick={() => {
                                        addCalassCard();
                                    }}
                                    className="tarjeta cursor-pointer"
                                    id="p"
                                >
                                    <div className="delantera">
                                        <div className="logo-marca">
                                            <img
                                                className={depositFormik.values.cardNumber ? true : 'hidden-image'}
                                                src={
                                                    depositFormik.values.cardNumber[0] == 4
                                                        ? IMG_MASTERCARD
                                                        : depositFormik.values.cardNumber[0] == 5
                                                            ? IMG_VISA
                                                            : (depositFormik.values.cardNumber = '')
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <img src={'/assets/images/chip-tarjeta.png'} className="chip" alt="" />
                                        <div className="datos">
                                            <div className="grupo">
                                                <label className="label">Numero Tarjeta</label>
                                                <p className="numero">
                                                    {depositFormik.values.cardNumber
                                                        ? depositFormik.values.cardNumber
                                                        : '#### #### #### ####'}
                                                </p>
                                            </div>
                                            <div className="flexbox">
                                                <div className="grupo">
                                                    <label className="label">Nombre Tarjeta</label>
                                                    <p className="nombre">
                                                        {depositFormik.values.fullName
                                                            ? depositFormik.values.fullName
                                                            : 'Jhon Doe'}
                                                    </p>
                                                </div>
                                                <div className="grupo">
                                                    <label className="label">Expiración</label>
                                                    <p className="expiracion">
                                                        <span className="month">
                                                            {depositFormik.values.month ? depositFormik.values.month : 'MM'}
                                                        </span>
                                                        /
                                                        <span className="year">
                                                            {depositFormik.values.expYear ? depositFormik.values.expYear : 'AA'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="trasera">
                                        <div className="barra-magnetica"></div>
                                        <div className="datos">
                                            <div className="grupo">
                                                <p className="label">Firma</p>
                                                <div className="firma">
                                                    <p>
                                                        {depositFormik.values.fullName
                                                            ? depositFormik.values.fullName
                                                            : 'Jhon Doe'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grupo ccv-div">
                                                <p className="label">CVV</p>
                                                <p className="ccv text-center">
                                                    {' '}
                                                    {depositFormik.values.ccv ? depositFormik.values.ccv : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="leyenda">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam repellat quae
                                            eius in numquam il mollitia temporibus a ab, ipsum fugiat enim aperiam?
                                        </p>
                                        <a href="#" className="link-banco">
                                            www.tubanco.com
                                        </a>
                                    </div>
                                </section>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12} display={'flex'} alignItems={'center'} spacing={2}>
                                <Grid md={9} sm={12} xs={12}>
                                    <Form className="form-group">
                                        <FormGroup>
                                            <Label for="cardNumber">Número tarjeta</Label>
                                            <Input
                                                type="text"
                                                name="cardNumber"
                                                placeholder="Ingrese el número de la tarjeta"
                                                onChange={depositFormik.handleChange}
                                                onBlur={depositFormik.handleBlur}
                                                value={formatValueCarNumber(depositFormik.values.cardNumber)}
                                                className="inputGlobal"
                                            />
                                            {depositFormik.touched.cardNumber && depositFormik.errors.cardNumber && (
                                                <div className="bg-slate-600 border-l-4">
                                                    <p style={{ color: 'black', padding: 3 }}>
                                                        {depositFormik.touched.cardNumber && depositFormik.errors.cardNumber}
                                                    </p>
                                                </div>
                                            )}
                                        </FormGroup>
                                    </Form>
                                </Grid>
                                <Grid md={3} sm={12} xs={12} className="m-r-card-logo">
                                    <Grid className="logo-marca-num-card">
                                        <img
                                            className={`${depositFormik.values.cardNumber ? true : 'hidden-image'} ${depositFormik.values.cardNumber[0] == 4 ? 'visa ' : 'master-card'
                                                }`}
                                            src={
                                                depositFormik.values.cardNumber[0] == 4
                                                    ? IMG_VISA_OLD
                                                    : depositFormik.values.cardNumber[0] == 5
                                                        ? IMG_MASTERCARD_OLD
                                                        : (depositFormik.values.cardNumber = '')
                                            }
                                            alt=""
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12} display={'flex'} justifyContent={'space-between'}>
                                <Grid md={4} sm={12} xs={12}>
                                    <Form>
                                        <FormGroup className="mb-4 ml-1">
                                            <Label for="categoria">Expiracón</Label>
                                            <Select
                                                className="xs-m-r"
                                                placeholder="Mes"
                                                value={
                                                    optionsMonth
                                                        ? depositFormik.values.month
                                                            ? options.find(
                                                                (option) => option.value === depositFormik.values.month.toString()
                                                            )
                                                            : ''
                                                        : ''
                                                }
                                                options={optionsMonth}
                                                onChange={(e) => onChangeExpMonth(e.value)}
                                            />
                                            <div className="bg-red-100 border-l-4">
                                                <p className="mb-0">
                                                    {depositFormik.touched.expYear && depositFormik.errors.expYear}
                                                </p>
                                            </div>
                                        </FormGroup>
                                    </Form>
                                </Grid>
                                <Grid md={4} sm={12} xs={12}>
                                    <Form>
                                        <FormGroup className="mb-4">
                                            <Label for="categoria">Año</Label>
                                            <Select
                                                className="xs-m-r"
                                                placeholder="Año"
                                                value={
                                                    options
                                                        ? depositFormik.values.expYear
                                                            ? options.find(
                                                                (option) =>
                                                                    option.value === depositFormik.values.expYear.toString()
                                                            )
                                                            : ''
                                                        : ''
                                                }
                                                options={options}
                                                onChange={(e) => onChangeExpYear(e.value)}
                                            />
                                            <div className="bg-red-100 border-l-4">
                                                <p className="mb-0">
                                                    {depositFormik.touched.expYear && depositFormik.errors.expYear}
                                                </p>
                                            </div>
                                        </FormGroup>
                                    </Form>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <Form>
                                        <FormGroup className="mb-4">
                                            <Label for="ccv">CVV</Label>
                                            <NumberFormat
                                                customInput={Input}
                                                isNumericString={true}
                                                thousandSeparator={true}
                                                id="ccv"
                                                name="ccv"
                                                placeholder="CVV"
                                                onChange={(e) => depositFormik.setFieldValue('ccv', e.target.value)}
                                                onBlur={depositFormik.handleBlur}
                                                value={depositFormik.values.ccv}
                                                className="inputGlobal"
                                            />
                                            <div className="bg-red-100 border-l-4">
                                                <p className="mb-0">
                                                    {depositFormik.touched.ccv && depositFormik.errors.ccv}
                                                </p>
                                            </div>
                                        </FormGroup>
                                    </Form>
                                </Grid>
                            </Grid>
                            <Grid item md={12} display={'flex'} justifyContent={'space-between'} sm={12} xs={12}>
                                <Grid item md={6} sm={12} xs={12}>
                                    <Form>
                                        <FormGroup className="mb-4 xs-m-r-amount">
                                            <Label for="amount">Monto (€)</Label>
                                            <NumberFormat
                                                customInput={Input}
                                                isNumericString={true}
                                                thousandSeparator={true}
                                                id="amount"
                                                name="amount"
                                                prefix="$"
                                                placeholder="Monto mìnimo 250 €"
                                                onChange={(e) =>
                                                    depositFormik.setFieldValue(
                                                        'amount',
                                                        formatoPrecio(e.target.value),
                                                        false
                                                    )
                                                }
                                                onBlur={depositFormik.handleBlur}
                                                value={depositFormik.values.amount}
                                                className="inputGlobal"
                                            />
                                            <div className="bg-red-100 border-l-4">
                                                <p className="mb-0">
                                                    {depositFormik.touched.amount && depositFormik.errors.amount}
                                                </p>
                                            </div>
                                        </FormGroup>
                                    </Form>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <Typography
                                        display={'flex'}
                                        className="mt-4 cursor-pointer"
                                        marginLeft={1}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            toggleModalTermAndConditions()
                                        }}
                                    >
                                        Terminos y condiciones
                                    </Typography>
                                    <Input
                                        type="checkbox"
                                        style={{ cursor: 'pointer' }}
                                        value={depositFormik.values.termAndConditions}
                                        onChange={(e) =>
                                            depositFormik.setFieldValue('termAndConditions', e.target.checked)
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ModalUtils>
            {/* Componente Loading */}
            {loading && <Loading />}
            {loadingMessageDeposit && (
                <LoadingConfirm isVisibilityChargin={visibilityCharging} msg={messageDeposit} />
            )}
            {/*Modal apra confirmar transacción*/}
            <ModalUtils
                title="Detalle solicitud depòsito"
                mtop={'0rem'}
                open={modalConfirm}
                toggle={toggleModalConfirm}
                handleChange={saveDeposit}
                spinner={spinner}
                visivilityModalFooter={true}
            >
                <Grid display={'flex'} flexDirection={'column'}>
                    <Typography style={{ fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Nombre:</span>{' '}
                        {depositFormik.values.fullName}{' '}
                    </Typography>
                    <Typography style={{ fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Email:</span>{' '}
                        {depositFormik.values.email}{' '}
                    </Typography>
                    <Typography style={{ fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Número tarjeta:</span>{' '}
                        {depositFormik.values.cardNumber}{' '}
                    </Typography>
                    <Typography style={{ fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Mes expiración: </span>{' '}
                        {depositFormik.values.month}{' '}
                    </Typography>
                    <Typography style={{ fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Año expiración: </span>{' '}
                        {depositFormik.values.expYear}{' '}
                    </Typography>
                    <Typography style={{ fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>CVV: </span>{' '}
                        {depositFormik.values.ccv}{' '}
                    </Typography>
                    <Typography style={{ fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Cantidad depósito </span>
                        <span span style={{ fontWeight: 'bold', fontSize: '9px' }}>
                            (€) :
                        </span>{' '}
                        {formatPrice(depositFormik.values.amount)}{' '}
                    </Typography>
                </Grid>
            </ModalUtils>
            <TermAndConditions open={modalTermAndConditions} />
        </Grid>
    );
};

export default React.memo(Deposits);
