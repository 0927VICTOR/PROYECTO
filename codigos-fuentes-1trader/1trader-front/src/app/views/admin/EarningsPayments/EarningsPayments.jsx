import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Badge,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    styled,
    Icon,
    FormGroup,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import NumberFormat from 'react-number-format';
import { Form, Input, Label } from 'reactstrap';
import RemoveIcon from '@mui/icons-material/Remove';

import PaidIcon from '@mui/icons-material/Paid';

import { ModalUtils } from 'app/components/Modal/ModalUtil';
import LoadingSpinner, { formatPrice, formatoPrecio, getHour } from 'app/utils/utils';
import SelectComponent from 'app/components/select/SelectComponent';
import ButtonAction from 'app/components/Button/ButtonAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCaretDown,
    faCaretUp,
    faCircleDollarToSlot,
    faPlusMinus,
    faRotate,
    faSackDollar,
    faSpinner,
    faTrashCan,
    faWallet,
} from '@fortawesome/free-solid-svg-icons';
import DataTable from 'app/components/DataTable/DataTable';
import moment from 'moment';

import compact from 'lodash/compact';
import { initiateSocket } from 'app/services/socket';
import { gambatteApi } from 'app/api/gambatteApi';
import { Message } from 'app/components/Notification/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { setEarningPaymentsThunk, updateEarningPaymentsThunk } from 'app/slices/adminSlice/earningPaymetsSlice';
import { ERRORNETWORK, ERROR_TRANSACTION, ROL_USER, SYSTEM_NOT_AVALIBLE } from 'app/utils/constant';
import { getFinancialActive } from 'app/services/utils.services';
import { Edit } from '@material-ui/icons';

let lookup = {}
const EarningsPayments = () => {

    const { id: idUser } = useParams();
    const [type, setType] = useState('');
    const [positionActive, setPositionActive] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [dataGoole, setDataGoogle] = useState([]);
    const [googleDataFilter, SetGoogleDataFilter] = useState([]);
    const [classSelectEEUU, setClassSelecteEEUU] = useState(false);
    const [classSelectEuropa, setClassSelecteEuropa] = useState(false);
    const [classSelectAsia, setClassSelecteAsia] = useState(false);
    const [classSelectDivisas, setClassSelecteDivisas] = useState(false);
    const [classSelectCriptoMoneda, setClassSelecteCriptoMoneda] = useState(false);
    const [classSelecFuturos, setClassSelecFuturos] = useState(false);
    const [dataActives, setDataActives] = useState([]);
    const [dataActivesPayment, setDataActivesPayment] = useState({ clientId: '', actives: [] });
    const [flagPayment, setFlagPayment] = useState(false);
    const [spinnerDataActives, setSpinnerDataActives] = useState(false);
    const [modalPaymentClient, setModalPaymentClient] = useState(false);
    const [stateUpdatePayement, setStateUpdatePayement] = useState(false);
    const [paymentId, setPaymentId] = useState(0);
    const [status, setStatus] = useState(false);
    const [valueEarning, setValueEarning] = useState(0);
    const [valueResult, setValueResult] = useState(0);
    const [totalEarning, setTotalEarning] = useState(0);
    const [amoutnInvesment, setAmoutnInvesment] = useState(0);
    const [modalUpdatePaymentClient, setModalUpdatePaymentClient] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [msg, setMsg] = useState({ state: false, msg: '' });

    const toggle = () => {
        setModalPaymentClient(!modalPaymentClient);
    };

    const toggleModalUpdatePaymentClient = () => {
        setModalUpdatePaymentClient(!modalUpdatePaymentClient);
    };

    const dispatch = useDispatch()
    let { earningPayments } = useSelector((state) => state.earningPayments)
    let { actives } = useSelector((state) => state.actives)


    let earningPaymentsFilter = earningPayments.filter(earn => parseInt(earn.id) === parseInt(idUser))

    if (earningPaymentsFilter.length > 0) {
        earningPayments = earningPaymentsFilter[0].account_?.payments?.map((pays) => {
            lookup[pays.status === 0 ? false : true] = pays.status === 0 ? 'Abierto' : 'Cerrado';
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
                    statusPayment: pays.statusPayment === 1 ? true : false,
                },
            };
        });
    }


    // earningPayments = earningPayments.filter(earn => parseInt(earn.id) === parseInt(idUser))[0]?.account_?.payments?.map(pays => {
    //     lookup[pays.status === 0 ? false : true] = pays.status === 0 ? 'Abierto' : 'Cerrado';
    //     return {
    //         idPayment: pays.idPayment,
    //         title: pays.title,
    //         price: pays.price,
    //         price_movement: {
    //             percentage: pays.percentage,
    //             value: pays.value,
    //             movement: pays.movement
    //         },
    //         payment: {
    //             investmentValue: pays.investmentValue,
    //             date: pays.date,
    //             hour: pays.hour,
    //             result: pays.result,
    //             total: pays.total,
    //             status: pays.status === 1 ? true : false,
    //             statusPayment: pays.statusPayment === 1 ? true : false,
    //         }
    //     }
    // })

    const [active, setActive] = useState([
        { value: 1, label: 'Nequi' },
        { value: 2, label: 'Ecopetrol' },
        { value: 3, label: 'Netflix' },
        { value: 4, label: 'Youtu-be' },
        { value: 5, label: 'Bancomex' },
        { value: 6, label: 'Finandina' },
    ]);

    let optionActives = []
    optionActives = actives.map(active => {
        return {
            value: active.idActive,
            label: active.name
        }
    })

    // console.log(optionActives);
    const toggleAciveModal = () => {
        setDataActives([]);
        clearForm()
        setModalActive(!modalActive);
    };

    useEffect(() => {
        const socket = initiateSocket();
        socket.on('finance-google-data', ({ data }) => {
            console.log('Data ===> ', data);
            if (Object.keys(data).length > 0) {
                setDataGoogle(data);
                SetGoogleDataFilter(data.markets.us);
                setClass('EE.UU');
            }
            return () => initiateSocket().close();
        });
        return () => initiateSocket().close();
    }, []);

    useEffect(async () => {
        let data = await getFinancialActive()
        if (Object.keys(data).length > 0) {
            setDataGoogle(data);
            SetGoogleDataFilter(data.markets.us);
            setClass('EE.UU');
        }
    }, []);

    const paymentFormik = useFormik({
        initialValues: {
            date: null,
            hour: '',
            active: '',
            investmentValue: '',
            earningAmount: '',
            earningState: '',
        },
        validationSchema: Yup.object({
            investmentValue: Yup.string()
                .min(0)
                .matches(/^[0-9]+$/gi, 'Solo se admiten números positivos')
                .required('Este campo es requerido'),
            active: Yup.string().required('Este campo es requerido'),
            earningState: Yup.string().required('Este campo es requerido'),
            earningAmount: Yup.string()
                .matches(/^[0-9\.-]+$/gi, 'Solo se admiten números')
                .required('Este campo es requerido'),
            active: Yup.string().required('Este campo es requerido'),
        })
    });

    const processPayment = () => {
        if (dataActivesPayment.actives.length > 0) {
            setSpinner(true)
            let data = {}
            data.clientId = idUser
            data.actives = [...dataActivesPayment.actives]
            // console.log(data);
            dispatch(setEarningPaymentsThunk(data, (error) => {
                if (error !== null && !error) {
                    setSpinner(false)
                    setFlagPayment(false)
                    // setDataActivesPayment({})
                    Message('success', 'Pagos', 'Pago realizado exitosamente')
                }
                else if (error.message === ERRORNETWORK) {
                    Message('error', 'Pagos', SYSTEM_NOT_AVALIBLE)
                    setSpinner(false)
                }
                else {
                    paymentFormik.resetForm()
                    Message('error', 'Pagos', ERROR_TRANSACTION)
                    setSpinner(false)
                }
            }))
        } else {
            Message('info', 'Pagos Cliente', 'Por favor asigna un pago para proceder con la solicitud')
            setSpinner(false)
        }
    }

    const [stateEarning, setStateEarning] = useState([
        { value: 2, label: 'Abierto' },
        { value: 1, label: 'Cerrado' },
    ]);



    const onChangeActive = async (value) => {
        clearForm()
        paymentFormik.resetForm()
        let acti = _.find(optionActives, (act) => act.value == value);
        paymentFormik.setFieldValue('active', value);
        setDataActives([]);
        setSpinnerDataActives(true);
        try {
            let {
                data: { data, status },
            } = await gambatteApi.get(`get-google-fianancial?active=${acti.label}`);
            if (status === 'ok') {
                if (data.length > 0) {
                    // console.log('No se encontraron datos');
                    setDataActives(data);
                    setSpinnerDataActives(false);
                    setMsg({ state: false, msg: '' });
                } else {
                    setMsg({ state: true, msg: 'No se encontraron datos' });
                    setSpinnerDataActives(false);
                }
            }
        } catch (error) {
            console.log('Error', error);
            setMsg({ state: true, msg: 'No se encontraron datos' });
            setSpinnerDataActives(false);
        }
    };

    const clearForm = () => {
        paymentFormik.values.earningAmount = '';
        paymentFormik.errors.earningAmount = false
        paymentFormik.values.earningState = '';
        paymentFormik.errors.earningState = false
        paymentFormik.values.investmentValue = '';
        paymentFormik.errors.investmentValue = false
        paymentFormik.values.active = '';
        paymentFormik.errors.active = false
    }

    const addActive = async (serpapi_link) => {
        paymentFormik.resetForm()
        setSpinnerDataActives(true);
        try {
            let {
                data: { data, status },
            } = await gambatteApi.get(`/get-google-fianancial-filter-active`, {
                params: { url: serpapi_link },
            });
            if (Object.keys(data)?.length > 0) {
                // console.log(data);let target = {
                let dates = {
                    title: data.title,
                    price: data.price,
                    price_movement: {
                        ...data.price_movement,
                    },
                    payment: {
                        investmentValue: 0,
                        date: null,
                        hour: null,
                        result: 0,
                        total: 0,
                        status: false
                    }
                };
                setSpinnerDataActives(false);
                setDataActivesPayment({
                    clientId: (dataActivesPayment.clientId = idUser),
                    actives: (dataActivesPayment.actives = [...dataActivesPayment.actives, dates]),
                })
                setPositionActive(dataActivesPayment.actives.length - 1)
                setFlagPayment(true)
            }
        } catch (error) {
            console.log('Error search data google', error);
            setSpinnerDataActives(false);
        }
    };

    const onChangeValue = (e, type) => {
        let actualActive
        if (Object.keys(dataActivesPayment)?.length > 0) {
            actualActive = dataActivesPayment?.actives[positionActive]
            if (type == 'investmentValue' && actualActive) {
                if (e !== null || e !== undefined || e !== "") {
                    // e = e.replace('$', '')
                    actualActive.payment.investmentValue = e
                    actualActive.payment.date = moment().format('YYYY-MM-DD')
                    actualActive.payment.hour = getHour()
                }
            }
            else if (type == 'status' && actualActive) {
                if (e == 1) {
                    actualActive.payment.status = true
                }
                else {
                    actualActive.payment.status = false
                }
            }
            else {
                setMsg({ state: true, msg: 'No se ha seleccionado ningún activo' })
            }
            dataActivesPayment.actives[positionActive] = actualActive
        } else {
            setMsg({ state: true, msg: 'No se ha seleccionado ningún activo' })
        }
    }

    const onBlurActive = (e) => {
        paymentFormik.touched.active = false;
    };

    const onChangeValueState = (value) => {
        onChangeValue(value, 'status')
        // let bank = _.find(banks, (bank => bank.id == value))
        paymentFormik.setFieldValue('earningState', value);
    };

    const onBlurEarning = (e) => {
        paymentFormik.touched.earningState = false;
    };

    let queryParams = new URLSearchParams(window.location.search);

    const stylesSelect = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? 'solid #ced4da' : 'solid #ced4da',
            border: !state.isFocused ? 'solid #ced4da' : 'solid #ced4da',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
        }),
        option: (baseStyles) => ({
            ...baseStyles,
            cursor: 'pointer',
            height: '41px',
        }),
        input: (baseStyles) => ({
            ...baseStyles,
            color: 'black',
        }),
        menu: (baseStyles) => ({
            ...baseStyles,
        }),
        valueContainer: (baseStyles, state) => ({
            ...baseStyles,
            // height: '30px',
            marginTop: -5,
        }),
    };

    const themeSelect = (theme) => ({
        ...theme,
        borderRadius: 5,
        controlHeight: 10,
        baseUnit: 0,
        colors: {
            ...theme.colors,
            primary25: '#b2b6d4',
            primary: '#111128',
        },
    });

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
            render: (rowData) => formatPrice(rowData.payment.investmentValue).replace('$', '€'),
            // type: 'currency',
            // currencySetting: {
            //     currenctCode: 'e', minimumFractionDigits: 0
            // },
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
        {
            title: 'Estado',
            field: 'payment.status',
            filter: true,
            lookup: lookup,
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

    let actions = [
        {
            icon: RemoveIcon,
            onClick: (event, rowData) => {
                return dataActivesPayment?.actives?.length > 0 ? deleteActive(rowData) : false;
            },
            tooltip: 'Remover',
        },
        {
            icon: Edit,
            onClick: (event, rowData) => {
                setPaymentId(rowData.idPayment)
                setStateUpdatePayement(rowData.payment.status)
                setAmoutnInvesment(rowData.payment.investmentValue)
                toggleModalUpdatePaymentClient()
            },
            tooltip: 'Ediar Pago',
        },
    ];

    const proccessPaymentUpdate = () => {
        let data = {
            idPayment: paymentId,
            statusPayment: status,
            result: valueResult,
            total: totalEarning,
            status: stateUpdatePayement == 1 ? true : false
        }
        // console.log(data);
        dispatch(updateEarningPaymentsThunk(data, idUser, (error) => {
            if (error !== null && !error) {
                setSpinner(false)
                setFlagPayment(false)
                setValueResult(0)
                setStateUpdatePayement(false)
                toggleModalUpdatePaymentClient()
                // setDataActivesPayment({})
                Message('success', 'Pagos', 'Pago actualizado exitosamente')
            }
            else if (error.message === ERRORNETWORK) {
                Message('error', 'Pagos', SYSTEM_NOT_AVALIBLE)
                setSpinner(false)
            }
            else {
                paymentFormik.resetForm()
                Message('error', 'Pagos', ERROR_TRANSACTION)
                setSpinner(false)
            }
        }))
    }

    const deleteActive = (row) => {
        let dataRemove = dataActivesPayment.actives.filter(x => x !== row)
        setDataActivesPayment({ actives: dataRemove })
    }

    const renderActiveDataPayment = (row) => {
        return (
            <Grid
                md={12}
                sm={12}
                xs={12}
                className={`content-inversion-payment cursor-pointer`}
                style={{ cursor: 'pointer' }}
            >
                <Grid md={12}
                    sm={12}
                    xs={12} container className="icon-up" >
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
                            <Grid md={12}
                                sm={12}
                                xs={12} className='style-card-payment-Table'>
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
                            <Grid md={12}
                                sm={12}
                                xs={12} className='style-card-payment-Table'>
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
        if (rowData.payment.statusPayment === true) {
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
                            {formatPrice(rowData.payment.total).replace('$', '€')}{' '}
                        </span>
                    </Grid>
                </Grid>
            );
        } else if (rowData.payment.statusPayment === false) {
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
                            {formatPrice(rowData.payment.total).replace('$', '€')}{' '}
                        </span>
                    </Grid>
                </Grid>
            );
        }
    };

    const renderEarningEarningActive = (rowData) => {
        if (rowData.payment.statusPayment === true) {
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
                            {formatPrice(rowData.payment.result).replace('$', '€')}{' '}
                        </span>
                    </Grid>
                </Grid>
            );
        } else if (rowData.payment.statusPayment === false) {
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
                            {formatPrice(rowData.payment.result).replace('$', '€')}{' '}
                        </span>
                    </Grid>
                </Grid>
            );
        }
    };

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

    const data = () => {
        if (flagPayment) {
            return dataActivesPayment.actives
        } else {
            if (earningPayments) {
                if (earningPayments[0] !== undefined || earningPayments.length > 0) {
                    return earningPayments !== undefined ? JSON.parse(JSON.stringify(earningPayments)) : []
                }
            }
        }
    }

    return (
        <Grid className="container">
            <Grid
                item
                sm={12}
                md={12}
                xs={12}
                className="mt-3"
                display={'flex'}
                justifyContent={'space-between'}
            >
                <Grid sm={12} md={4} xs={12} className="mt-2">
                    <ButtonAction
                        classNameButon={'button-maim'}
                        handle={toggleAciveModal}
                        title={'Activo'}
                        size={'sm'}
                        fontIcon={<FontAwesomeIcon style={{ marginRight: '2px' }} icon={faPlusMinus} />}
                    />
                    <ButtonAction
                        classNameButon={'button-maim'}
                        handle={() => { setDataActivesPayment({}); setFlagPayment(false) }}
                        title={'Borrar'}
                        size={'sm'}
                        fontIcon={<FontAwesomeIcon style={{ marginRight: '2px' }} icon={faTrashCan} />}
                    />
                    <Grid sm={12} md={4} xs={12} className="mt-1 btn-proccess-payments">
                        <ButtonAction
                            classNameButon={'button-maim'}
                            handle={processPayment}
                            title={'Procesar Pagos'}
                            size={'sm'}
                            fontIcon={<FontAwesomeIcon style={{ marginRight: '2px' }} icon={spinner ? faRotate : faCircleDollarToSlot} spin={spinner ? true : false} />}
                        />
                    </Grid>
                </Grid>
                <Grid item sm={12} md={4} xs={12} className="mt-2" display={'flex'}>
                    <Typography variant="h6">
                        {' '}
                        <FontAwesomeIcon style={{ marginRight: '2px' }} icon={faWallet} display={'flex'} />
                        {`Operaciones - ${queryParams.get('name')}`}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item className="container container-inversion">
                <Grid item md={12}>
                    <Grid className="markets-title">
                        <Typography className="markets-title2">Mercados</Typography>
                    </Grid>
                    <div
                        item
                        md={12}
                        className={`markets-invest ${classSelectEEUU ? 'markets-invest-select' : false}`}
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
            {/* <div className="ppal-div-markets"> */}
            <Grid item container md={12} sm={6} xs={12} marginTop={1}>
                {googleDataFilter &&
                    googleDataFilter.map((el) => {
                        const nf = new Intl.NumberFormat('en-US');
                        return (
                            <Grid md={2} sm={6} xs={12} className={`content-inversion`}>
                                <Grid item className="icon-up">
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
                                                <Typography style={{ fontSize: '.75rem', fontFamily: 'Roboto,Arial,sans-serif;' }}>{el.name}</Typography>
                                            </Grid>{' '}
                                            <Grid sm={12} xs={12}>
                                                <span style={{ fontSize: '.75rem' }}>{nf.format(el.price)} </span>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid className={`conatiner-3`}>
                                        <Grid sm={12} xs={12}>
                                            <Grid sm={12} xs={12}>
                                                {el.price_movement.movement === 'Up' ? (
                                                    <Typography
                                                        className="moven-up"
                                                        style={{ fontSize: '.75rem', fontWeight: 'bold' }}
                                                    >
                                                        + {Number.parseFloat(el.price_movement.percentage).toFixed(2)} %
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        className="moven-down"
                                                        style={{ fontSize: '.75rem', fontWeight: 'bold', marginLeft: '6px' }}
                                                    >
                                                        - {Number.parseFloat(el.price_movement.percentage).toFixed(2)} %
                                                    </Typography>
                                                )}
                                            </Grid>{' '}
                                            <Grid sm={12} xs={12}>
                                                {el.price_movement.movement === 'Up' ? (
                                                    <span
                                                        className="moven-up"
                                                        style={{ fontSize: '.75rem', fontWeight: 'bold' }}
                                                    >
                                                        + {Number.parseFloat(el.price_movement.value).toFixed(2)}{' '}
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="moven-down"
                                                        style={{ fontSize: '.75rem', fontWeight: 'bold', marginLeft: '6px' }}
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
            <Grid className="mb-2">
                <DataTable
                    title="Pagos"
                    columns={columns}
                    // newData={flagPayment ? dataActivesPayment.actives : newDataActivesPayment[0]}
                    newData={data()}
                    // newData={usersData.length > 0 ? JSON.parse(JSON.stringify(usersData)) : []}
                    size={4}
                    actions={actions}
                    mtToolbar={null}
                />
            </Grid>
            {/* Modal para agregar activos del cliente */}
            <ModalUtils
                title={<Typography variant='h6'>Activos</Typography>}
                w100Modal={'w100Modal'}
                mtop={'0px'}
                size={''}
                open={modalActive}
                toggle={toggleAciveModal}
                handleChange={toggleAciveModal}
                spinner={spinner}
                disabled={false}
                visivilityModalFooter={true}
            >
                <Grid container spacing={1} >
                    <Grid md={4} sm={6} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="state">Activo</Label>
                                <SelectComponent
                                    optionsValues={optionActives}
                                    valueOp={paymentFormik.values.active}
                                    handle={onChangeActive}
                                    onBlurFn={onBlurActive}
                                    placeHolder="Seleccione el activo"
                                    name="state"
                                    styles={stylesSelect}
                                    theme={themeSelect}
                                />
                                <div className="bg-red-100 border-l-4">
                                    <p className="mb-0">
                                        {paymentFormik.touched.active && paymentFormik.errors.active}
                                    </p>
                                </div>
                            </FormGroup>
                        </Form>
                        {spinnerDataActives && (<Grid
                            display={'flex'}
                            alignContent={'center'}
                            alignItems={'center'}
                            style={{ marginTop: '10px' }}
                        >
                            {spinnerDataActives && <Grid>{<LoadingSpinner />}</Grid>}
                        </Grid>
                        )}
                    </Grid>
                    <Grid md={8} sm={6} xs={12}  >
                        <Grid container md={12} sm={12} xs={12} >
                            <Grid md={4} sm={6} xs={12} style={{ marginLeft: '10px' }}>
                                <Form >
                                    <FormGroup >
                                        <Label for="investmentValue">Monto inversion (€)</Label>
                                        <NumberFormat
                                            customInput={Input}
                                            isNumericString={true}
                                            thousandSeparator={true}
                                            id="amount"
                                            name="investmentValue"
                                            // prefix="$"
                                            placeholder="Monto inversion"
                                            onChange={(e) => {
                                                onChangeValue(e.target.value, 'investmentValue')
                                                paymentFormik.setFieldValue('investmentValue', formatoPrecio(e.target.value), false)
                                            }}
                                            onBlur={paymentFormik.handleBlur}
                                            value={paymentFormik.values.investmentValue}
                                            className="color-investmentValue"
                                        // style={{ color: 'black' }}
                                        />
                                        <div className="bg-red-100 border-l-4">
                                            <p className="mb-0">
                                                {paymentFormik.touched.investmentValue && paymentFormik.errors.investmentValue}
                                            </p>
                                        </div>
                                    </FormGroup>
                                </Form>
                            </Grid>
                            <Grid md={4} sm={6} xs={12} style={{ marginLeft: '10px' }}>
                                <Form>
                                    <FormGroup>
                                        <Label for="state">Estado</Label>
                                        <SelectComponent
                                            optionsValues={stateEarning}
                                            valueOp={paymentFormik.values.earningState}
                                            handle={onChangeValueState}
                                            onBlurFn={onBlurActive}
                                            placeHolder="Seleccione el estado"
                                            name="earningState"
                                            styles={stylesSelect}
                                            theme={themeSelect}
                                        />
                                        <div className="bg-red-100 border-l-4">
                                            <p className="mb-0">
                                                {paymentFormik.touched.earningState && paymentFormik.errors.earningState}
                                            </p>
                                        </div>
                                    </FormGroup>
                                </Form>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container md={12}
                        sm={12}
                        xs={12} >
                        {dataActives?.length > 0 &&
                            dataActives?.map((el) => {
                                return (
                                    <Grid
                                        container
                                        md={3}
                                        sm={3}
                                        xs={12}
                                        className={`content-inversion mt-3 cursor-pointer`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => addActive(el.serpapi_link)}
                                    >
                                        <Grid container className="icon-up">
                                            <Grid
                                                item
                                                className={`${el.movement === 'Up' ? 'icon-up-card' : 'icon-down-card'}`}
                                            >
                                                {el.movement === 'Up' ? (
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
                                            <Grid className={`conatiner-2`} style={{ marginLeft: '3px' }}>
                                                <Grid sm={12} xs={12}>
                                                    <Grid sm={12} xs={12}>
                                                        <Typography style={{ fontSize: '9px' }}>{el.stock}</Typography>
                                                    </Grid>{' '}
                                                    <Grid sm={12} xs={12}>
                                                        <span style={{ fontSize: '9px' }}>{el.price} </span>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid className={`conatiner-3`} style={{ marginLeft: '6px' }}>
                                                <Grid sm={12} xs={12}>
                                                    <Grid sm={12} xs={12}>
                                                        {el.movement === 'Up' ? (
                                                            <Typography
                                                                className="moven-up"
                                                                style={{ fontSize: '9px', fontWeight: 'bold' }}
                                                            >
                                                                {' '}
                                                                {el.currency}
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                className="moven-down"
                                                                style={{ fontSize: '9px', fontWeight: 'bold' }}
                                                            >
                                                                {el.currency}
                                                            </Typography>
                                                        )}
                                                    </Grid>{' '}
                                                    <Grid sm={12} xs={12}>
                                                        {el.movement === 'Up' ? (
                                                            <span
                                                                className="moven-up"
                                                                style={{ fontSize: '9px', fontWeight: 'bold' }}
                                                            >
                                                                +{el.extracted_price}{' '}
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className="moven-down"
                                                                style={{ fontSize: '9px', fontWeight: 'bold' }}
                                                            >
                                                                -{el.extracted_price}
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
                    {msg.state == true && (
                        <Grid md={6} sm={12} xs={12} className="mt-1">
                            <div
                                className="div-erros-login bg-red-500 border-l-4"
                                style={{ marginLeft: '0px', padding: '2px' }}
                            >
                                <Typography variant="h5">{msg.msg}</Typography>
                            </div>
                        </Grid>
                    )}
                </Grid>
            </ModalUtils>
            {/* Modal para actualizar pagos de un cliente */}
            <ModalUtils
                title={<Typography variant='h6'>Actualizar Pago Activo</Typography>}
                w100Modal={'w50Modal'}
                mtop={'0px'}
                size={''}
                open={modalUpdatePaymentClient}
                toggle={toggleModalUpdatePaymentClient}
                handleChange={proccessPaymentUpdate}
                spinner={spinner}
                disabled={false}
                visivilityModalFooter={true}
            >
                <Grid container md={12} sm={12} spacing={1} >
                    <Grid md={5} sm={6} xs={12} style={{ marginLeft: '10px' }}>
                        <Form>
                            <FormGroup>
                                <Label for="amount">Ganacia (€)</Label>
                                <NumberFormat
                                    customInput={Input}
                                    isNumericString={true}
                                    thousandSeparator={true}
                                    id="amount"
                                    // prefix=""
                                    placeholder="Ganancia"
                                    onChange={(e) => {
                                        let val = e.target.value
                                        if (val.includes("-")) {
                                            console.log(val);
                                            // val = val.replace('$', '').replace('-', '')
                                            val = val.replace('-', '')
                                            setValueResult(parseFloat(Number(val)))
                                            setTotalEarning(parseFloat(Number(val) + Number(amoutnInvesment)))
                                            setStatus(false)
                                        }
                                        else {
                                            // val = val.replace('$', '')
                                            setValueResult(parseFloat(Number(val)))
                                            setTotalEarning(parseFloat(Number(val) + Number(amoutnInvesment)))
                                            setStatus(true)
                                        }
                                        setValueEarning(e.target.value)
                                    }}
                                    onBlur={() => {

                                    }}
                                    value={valueEarning}
                                    className="inputGlobal"
                                />
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid md={6} sm={6} xs={12} style={{ marginLeft: '10px' }}>
                        <Form>
                            <FormGroup>
                                <Label for="state">Estado</Label>
                                <SelectComponent
                                    optionsValues={stateEarning}
                                    valueOp={stateUpdatePayement}
                                    handle={(vale) => {
                                        console.log('values', vale);
                                        setStateUpdatePayement(vale)
                                    }}
                                    onBlurFn={() => {

                                    }}
                                    placeHolder="Seleccione el estado"
                                    styles={stylesSelect}
                                    theme={themeSelect}
                                />
                            </FormGroup>
                        </Form>
                    </Grid>
                </Grid>
            </ModalUtils>
        </Grid>
    );
};

export default React.memo(EarningsPayments);
