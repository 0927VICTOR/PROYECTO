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
    faArrowTrendDown,
    faArrowTrendUp,
    faCaretDown,
    faCaretUp,
    faCircleDollarToSlot,
    faCommentDollar,
    faFilterCircleDollar,
    faHandHoldingDollar,
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
import { setEarningPaymentsThunk } from 'app/slices/adminSlice/earningPaymetsSlice';
import { ERRORNETWORK, ERROR_TRANSACTION, ROL_USER, SYSTEM_NOT_AVALIBLE } from 'app/utils/constant';
import { getFinancialActive } from 'app/services/utils.services';
import useAuth from 'app/hooks/useAuth';
import { RemoveRedEye } from '@material-ui/icons';
let lookup = {}
const EarningsPayments = () => {
    const { user } = useAuth();
    const [dataGoole, setDataGoogle] = useState([]);
    const [googleDataFilter, SetGoogleDataFilter] = useState([]);
    const [classSelectEEUU, setClassSelecteEEUU] = useState(false);
    const [classSelectEuropa, setClassSelecteEuropa] = useState(false);
    const [classSelectAsia, setClassSelecteAsia] = useState(false);
    const [classSelectDivisas, setClassSelecteDivisas] = useState(false);
    const [classSelectCriptoMoneda, setClassSelecteCriptoMoneda] = useState(false);
    const [classSelecFuturos, setClassSelecFuturos] = useState(false);
    const [dataActives, setDataActives] = useState({});
    const [dataActivesPayment, setDataActivesPayment] = useState({ clientId: '', actives: [] });
    const [flagPayment, setFlagPayment] = useState(false);
    const [detailModalPayment, setDetailModalPayment] = useState(false);
    const [msg, setMsg] = useState({ state: false, msg: '' });

    const toggle = () => {
        setDetailModalPayment(!detailModalPayment);
    };

    let { earningPayments } = useSelector((state) => state.earningPayments);

    let earningPaymentsFilter = earningPayments.filter(earn => parseInt(earn.id) === parseInt(user.id))
    if (earningPaymentsFilter.length > 0) {
        earningPayments = earningPaymentsFilter[0]?.account_?.payments?.map((pays) => {
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
    // console.log('earningPaymentsFilter ', earningPaymentsFilter);

    useEffect(() => {
        const socket = initiateSocket();
        socket.on('finance-google-data', ({ data }) => {
            console.log(data);
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
        let data = await getFinancialActive();
        if (Object.keys(data).length > 0) {
            setDataGoogle(data);
            SetGoogleDataFilter(data.markets.us);
            setClass('EE.UU');
        }
    }, []);

    const [active, setActive] = useState([
        { value: 1, label: 'Nequi' },
        { value: 2, label: 'Ecopetrol' },
        { value: 3, label: 'Netflix' },
        { value: 4, label: 'Youtu-be' },
        { value: 5, label: 'Bancomex' },
        { value: 6, label: 'Finandina' },
    ]);

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
            //     currenctCode: 'us',
            //     minimumFractionDigits: 0,
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
            icon: RemoveRedEye,
            onClick: (event, rowData) => {
                console.log('rowData ', rowData);
                setDataActives(rowData);
                toggle();
            },
            tooltip: 'Detalle',
        },
        // {
        //     icon: PaidIcon,
        //     onClick: (event, rowData) => {
        //         if (rowData.state === 0) {
        //             // openModalPaymentClient(rowData);
        //         }
        //     },
        //     tooltip: 'Pagar',
        // },
    ];

    const deleteActive = (row) => {
        let dataRemove = dataActivesPayment.actives.filter((x) => x !== row);
        setDataActivesPayment({ actives: dataRemove });
    };

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
                                    {` ${row?.price_movement?.value}`}
                                </span>
                                <span style={{ fontSize: '11px', marginLeft: '5px', fontWeight: 'bold' }}>
                                    {` ${row?.price_movement?.percentage} `}
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
        if (rowData?.payment?.statusPayment === true) {
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
                            {formatPrice(rowData?.payment?.total).replace('$', '€')}{' '}
                        </span>
                    </Grid>
                </Grid>
            );
        } else if (rowData?.payment?.statusPayment === false) {
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
                            {formatPrice(rowData?.payment?.total).replace('$', '€')}{' '}
                        </span>
                    </Grid>
                </Grid>
            );
        }
    };

    const renderEarningEarningActive = (rowData) => {
        if (rowData?.payment?.statusPayment === true) {
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
        } else if (rowData?.payment?.statusPayment === false) {
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
                            {formatPrice(rowData?.payment?.result).replace('$', '€')}{' '}
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
            return dataActivesPayment.actives;
        } else {
            if (earningPayments[0] !== undefined || earningPayments.length > 0) {
                return earningPayments !== undefined ? JSON.parse(JSON.stringify(earningPayments)) : [];
            }
        }
    };

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
                <Grid item sm={12} md={4} xs={12} className="mt-2" display={'flex'} mb={4}>
                    <Typography variant="h6">
                        {' '}
                        <FontAwesomeIcon
                            style={{ marginRight: '2px' }}
                            icon={faHandHoldingDollar}
                            display={'flex'}
                        />
                        {`Pagos - ${user.fullName}`}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item className="container container-inversion" s>
                <Grid item md={12} >
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
            {/* <Grid className="ppal-div-markets"> */}
            <Grid item container md={12} sm={12} xs={12} marginTop={1}>
                {googleDataFilter &&
                    googleDataFilter.map((el) => {
                        const nf = new Intl.NumberFormat('en-US');
                        return (
                            <Grid md={2} sm={6} xs={12} style={{ height: '50px' }} className={`container content-inversion`}>
                                <Grid className="icon-up" >
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
                                <Grid item className={`conatiner-1`}>
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
                                    <Grid item className={`conatiner-3`}>
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
            {/* </Grid> */}
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
                title={<Typography variant="h6">Detalle Pago</Typography>}
                w100Modal={'w30Modal'}
                mtop={'0px'}
                size={''}
                open={detailModalPayment}
                toggle={toggle}
                handleChange={toggle}
                disabled={false}
                visivilityModalFooter={true}
            >
                <Grid container spacing={1}>
                    <Grid item md={8} sm={12} xs={12} display={'flex'} justifyContent={'space-between'}>
                        <Typography style={{ fontSize: '15px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Activo</span>{' '}
                        </Typography>
                        <small className="custom-small-title" >
                            <FontAwesomeIcon style={{ marginRight: '3px' }} icon={faCommentDollar} />
                            {dataActives.title}
                        </small>
                    </Grid>
                    <Grid item md={8} sm={12} xs={12} display={'flex'} justifyContent={'space-between'}>
                        <Typography style={{ fontSize: '15px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Precio</span>{' '}
                        </Typography>
                        <Typography style={{ fontSize: '15px' }}>{dataActives.price}</Typography>
                    </Grid>
                    <Grid item md={8} sm={12} xs={12} display={'flex'} justifyContent={'space-between'}>
                        <Typography style={{ fontSize: '15px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Fecha</span>{' '}
                        </Typography>
                        <Typography style={{ fontSize: '15px' }}>{dataActives?.payment?.date}</Typography>
                    </Grid>
                    <Grid item md={8} sm={12} xs={12} display={'flex'} justifyContent={'space-between'}>
                        <Typography style={{ fontSize: '15px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Resultado</span>{' '}
                        </Typography>
                        <Typography style={{ fontSize: '15px' }}>
                            <small
                                className={`${dataActives?.payment?.status == 1 ? 'custom-small' : 'custom-small-faild'
                                    }`}
                            >
                                <FontAwesomeIcon
                                    style={{ marginRight: '2px', color: '#fff' }}
                                    icon={dataActives?.payment?.status ? faArrowTrendUp : faArrowTrendDown}
                                />
                                {dataActives?.payment?.result}
                            </small>
                        </Typography>
                    </Grid>
                    <Grid item md={8} sm={12} xs={12} display={'flex'} justifyContent={'space-between'}>
                        <Typography style={{ fontSize: '15px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Total</span>{' '}
                        </Typography>
                        <Typography style={{ fontSize: '15px' }}>
                            <small className="custom-small">
                                <FontAwesomeIcon
                                    style={{ marginRight: '2px', color: '#fff' }}
                                    icon={faHandHoldingDollar}
                                />
                                {dataActives?.payment?.total}
                            </small>
                        </Typography>
                    </Grid>
                </Grid>
            </ModalUtils>
        </Grid>
    );
};

export default React.memo(EarningsPayments);
