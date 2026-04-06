import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import NumberFormat from 'react-number-format';
import { useParams } from 'react-router';
import { Form, Input, Label } from 'reactstrap';
import moment from 'moment';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import PaidIcon from '@mui/icons-material/Paid';
import Loading from 'app/components/Loading/Loading.jsx';
import {
    useLocation,
    useSearchParams
} from "react-router-dom";
//Slices


import ButtonAction from 'app/components/Button/ButtonAction';
import { Message } from 'app/components/Notification/Notification';
import { ModalUtils } from 'app/components/Modal/ModalUtil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faRotate } from '@fortawesome/free-solid-svg-icons';
import {
    BASE_URL_PROD,
    BASE_URL_NGROK,
    DATA_UPDATE,
    ERRORNETWORK,
    ERROR_OPERATION,
    ERROR_TRANSACTION,
    IMG_AVATAR,
    SYSTEM_NOT_AVALIBLE,
} from '../../../utils/constant';
import { Paragraph, Small } from '../../../components/Typography';
import DataTable from 'app/components/DataTable/DataTable';
import LoadingSpinner, { findData, formatPrice, formatoPrecio, generateCardToken, getHour, getValueDocumentType, validState } from 'app/utils/utils';
import { getBanks, getCountries } from 'app/services/utils.services';
import SelectComponent from 'app/components/select/SelectComponent';
import { initiateSocket } from 'app/services/socket';
import { updateDepositsExpensesById } from 'app/slices/adminSlice/depositsExpenses/thunk';

let datafilters = []

const NotificationsPayments = (search) => {
    const [spinner, setSpinner] = useState(false);
    const [newData, setNewData] = useState([]);
    const [copyNewData, setNCopyNewData] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [banks, setOptionsBanks] = useState([]);
    const [client, setClient] = useState('');
    const [optionsCountries, setOptionsCountries] = useState([]);
    const [operationData, setOperationData] = useState({});
    const [modalOperationClient, setModalOperationClient] = useState(false);
    const [modalPaymentClient, setModalPaymentClient] = useState(false);
    const [cantDeposits, setCantDeposits] = useState(0);
    const [cantExpenses, setCantExpenses] = useState(0);
    const [cardsUser, setCardsUser] = useState([]);
    const [cardUser, setCardUser] = useState({});
    const [depositsExpenses, setDepositsExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(false);
    const [flag, setFlag] = useState(false);
    const toggleModalOperationClient = () => {
        setModalOperationClient(!modalOperationClient);
    };

    const openModalUserDataInfo = () => {
        setModalPaymentClient(!modalPaymentClient);
    };

    const [documentType, setDocumentType] = useState([
        { id: 1, documentType: 'CC' },
        { id: 2, documentType: 'CE' },
        { id: 3, documentType: 'PASAPORTE' },
        { id: 4, documentType: 'TI' },
    ]);


    const [statePayment, setStatePayment] = useState([
        { value: 1, label: 'Pagado' },
        { value: 2, label: 'Cancelado' },
    ]);

    const getValueBank = (filter) => {
        return findData(banks, { value: filter })?.label || '';
    };

    const { id: idNotificationUser } = useParams();

    const dispatch = useDispatch();

    let { users, isLoading } = useSelector((state) => state.users);

    users = _.find(users, { id: parseInt(idNotificationUser) });

    // useEffect(async () => {
    //     console.log('Mapeo de depositos', depositsExpenses);
    //     if (Object.keys(depositsExpenses).length > 0 && depositsExpenses !== undefined) {
    //         await mapDepositsExpenses(depositsExpenses)
    //     }
    // }, [depositsExpenses])


    let queryParams = new URLSearchParams(window.location.search);


    const paymentFormik = useFormik({
        initialValues: {
            amount: '',
            description: '',
            paymentDate: null,
            state: '',
        },
        validationSchema: Yup.object({
            amount: Yup.string()
                // .required('Este campo es requerido')
                .min(0)
                .matches(/^[0-9]+$/gi, 'Solo se admiten números positivos')
                .required('Este campo es requerido'),
            state: Yup.string().required('Este campo es requerido'),
            // description: Yup.string()
            //     .required('Este campo es requerido'),
        }),
        onSubmit: () => {
            if (paymentFormik.isValid) {
                let values = paymentFormik.values;
                let data = {
                    [operationData.idDeposit ? 'paymentDeposit' : 'paymentExpense']: {
                        idUser: currentUser.id,
                        typeOperation: operationData.idDeposit ? 'deposit' : 'expense',
                        idOperation: operationData.idDeposit ? operationData.idDeposit : operationData.idExpenses,
                        paymentDate: moment().format('YYYY/MM/DD'),
                        amount: values.amount,
                        state: values.state,
                        description: values.description ? values.description : '',
                        hour: getHour().toString()
                    },
                };
                setSpinner(true)
                dispatch(updateDepositsExpensesById(data, async (error) => {
                    if (error !== null && !error) {
                        setDepositsExpenses([])
                        setLoading(true)
                        setFlag(false)
                        setTimeout(async () => {
                            await mapFiltersPayments(datafilters)
                            await countDepositExpenses(datafilters)
                            setLoading(false)
                        }, 3000);
                        setTimeout(async () => {
                            paymentFormik.resetForm()
                        }, 3000);
                        setSpinner(false)
                        // setFlag(true)
                        setModalPaymentClient(false)
                    }
                    else if (error.message === ERRORNETWORK) {
                        Message('error', 'Depósito', SYSTEM_NOT_AVALIBLE)

                    }
                    else {
                        paymentFormik.resetForm()
                        Message('error', 'Depósito', ERROR_TRANSACTION)
                    }
                }))
            }
        },
    });

    let optionsDocumentType = documentType.map((el, index) => {
        return {
            value: el.id,
            label: el.documentType,
        };
    });

    useEffect(() => {
        const socket = initiateSocket()
        socket.on('deposits-expenses', ({ depositsExpenses: data }) => {
            if (data.length > 0) {
                setDepositsExpenses(data)
            }
            return () => initiateSocket().close();
        })
        return () => initiateSocket().close();
    }, [])

    useEffect(async () => {
        if (depositsExpenses.length > 0) {
            let filterData = _.filter(depositsExpenses, x => x.id == paymentFormik.values.id)
            setNewFilterDepositsExpenses(filterData)
        }
    }, [depositsExpenses]);

    const setNewFilterDepositsExpenses = (filterData) => {
        datafilters = [...filterData]
    }

    useEffect(() => {
        setCantDeposits(queryParams.get('cant_deposist'))
        setCantExpenses(queryParams.get('cant_expenses'))
    }, [])

    useEffect(async () => {
        let data;
        let banks = await getBanks();
        if (banks.length > 0) {
            data = banks.map((el) => {
                return {
                    value: el.idBank,
                    // label: renderHTML(el.ESPANOL, el.PHONE_CODE)
                    label: el.name,
                };
            });
        }
        setOptionsBanks(data);
    }, []);

    useEffect(async () => {
        let data;
        let contries = await getCountries();
        if (contries.length > 0) {
            data = contries.map((el) => {
                return {
                    value: el.id,
                    // label: renderHTML(el.ESPANOL, el.PHONE_CODE)
                    label: el.ESPANOL + ' (+' + el.PHONE_CODE + ')',
                };
            });
        }
        setOptionsCountries(data);
    }, []);

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
            marginTop: -5
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

    const mapDepositsExpenses = async (depositsExpenses, cli = null, type) => {
        let dataDepositExpenses = [];
        setNewData([]);
        let cardsUser = [];
        if (cli !== undefined) {
            let depExp = _.find(depositsExpenses, { id: cli });
            let account
            if (depExp) {
                account = depExp?.account_?.balance
                const {
                    account_,
                    cards,
                    password,
                    rol_idrol,
                    finishRegister,
                    documentImagenFront,
                    documentImagenPost,
                    ...userData
                } = depExp;
                userData.balance = account
                setCurrentUser({ ...userData });
            }
        }
        _.mapValues(depositsExpenses, (el) => {
            if (cli !== undefined && el.id == cli) {
                let cursor = el?.account_;
                if (el?.cards?.length > 0) {
                    el?.cards?.forEach((el) => {
                        cardsUser.push({
                            idCard: el?.idCard,
                            cardNumber: generateCardToken(el?.cardNumber),
                            cvv: generateCardToken(el?.cvv),
                            expYear: generateCardToken(el?.expYear),
                            month: generateCardToken(el?.month),
                        });
                    });
                    setCardsUser([...cardsUser]);
                }
                if (cursor?.deposits?.length > 0 && type == 'deposits') {
                    let filterData = cursor?.deposits?.filter(d => d.state == 0)
                    dataDepositExpenses = [...filterData];
                }
                if (cursor?.expenses?.length > 0 && type == 'expenses') {
                    let filterData = cursor?.expenses?.filter(e => e.state == 0)
                    dataDepositExpenses = [...filterData];
                }
            }
            else if (dataDepositExpenses.length > 0) {
                setTimeout(() => {
                    setLoading(false)
                    setMsg(false)
                    setFlag(true)
                    setNewData(dataDepositExpenses)
                }, 3000)
            }
            else {
                setTimeout(() => {
                    setLoading(false)
                    setFlag(true)
                    if (dataDepositExpenses.length > 0) {
                        setMsg(false)
                        setFlag(true)
                    }
                    else {
                        setMsg(true)
                    }
                }, 2000)
                depositsExpenses = []
            }
        });
    };

    const mapFiltersPayments = async (dataFilters) => {
        let copyData = []
        let data = []
        if (operationData.idExpenses) {
            let expenses = dataFilters[0]?.account_?.expenses
            data = expenses?.filter(x => x.state == 0)
        }
        else {
            let deposits = dataFilters[0]?.account_?.deposits
            data = deposits?.filter(x => x.state == 0)
        }
        if (data === undefined) {
            setNewData(copyData)
        }
        else if (data.length > 0) {
            setNewData(data)
            setFlag(true)
        }
        else {
            setNewData(copyData)
        }
    }

    const countDepositExpenses = async (dataFilters) => {
        if (operationData.idExpenses) {
            let expenses = dataFilters[0]?.account_?.expenses
            let data = expenses?.filter(x => x.state == 0)
            data?.length > 0 ? setCantExpenses(data.length) : setCantExpenses(0)
        }
        else {
            let deposits = dataFilters[0]?.account_?.deposits
            let data = deposits?.filter(x => x.state == 0)
            data?.length > 0 ? setCantDeposits(data.length) : setCantDeposits(0)
        }
    }

    useEffect(() => {
        setClient('');
        setNCopyNewData([]);
        setNewData([]);
    }, [idNotificationUser])

    const mapDepositsClient = (type) => {
        let val = parseInt(idNotificationUser);
        setClient(val);
        setNCopyNewData([]);
        setNewData([]);
        paymentFormik.setFieldValue('id', idNotificationUser)
        if (depositsExpenses.length > 0 && depositsExpenses !== undefined) {
            setNCopyNewData([]);
            setNewData([]);
            setLoading(true)
            mapDepositsExpenses(depositsExpenses, val, type);
        }
    };

    const columns = [
        {
            title: 'Fecha',
            render: (rowData) => {
                if (rowData?.depositDate) {
                    return rowData?.depositDate;
                } else if (rowData?.expensesDate) {
                    return rowData?.expensesDate;
                }
            },
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
            field: 'hour',
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
            title: 'Tipo Movimiento',
            fontSize: 13,
            render: (rowData) => {
                if (rowData?.idDeposit) {
                    return 'Depósito';
                } else if (rowData?.idExpenses) {
                    return 'Retiro';
                }
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
            title: 'Monto (€)',
            field: 'amount',
            render: (rowData) => `${formatPrice(rowData.amount).replace('$', '€')}`,
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
            field: 'state',
            render: (rowData) => validState(rowData.state),
            cellStyle: {
                textAlign: 'center',
                fontSize: 13,
            },
            headerStyle: {
                textAlign: 'center',
            },
        },
    ];

    const getValueCountry = (idCountry) => {
        if (idCountry) {
            return _.find(optionsCountries, { value: parseInt(idCountry) })?.label || '';
        } else {
            return '';
        }
    };

    const openModalUserDataInfoCleint = (row) => {
        if (cardsUser?.length > 0) {
            let card = _.find(cardsUser, { idCard: row.idCard })
            if (card) {
                setCardUser(card)
            }
        }
        setOperationData(row);
        setModalOperationClient(true);
    };

    const openModalPaymentClient = (row) => {
        setOperationData(row);
        paymentFormik.values.amount = row.amount
        setModalPaymentClient(true);
    };

    const onChangeStatePayment = (value) => {
        paymentFormik.setFieldValue('state', value);
    };

    const onBlurPaymentState = (e) => {
        paymentFormik.touched.state = false;
    };

    let actions = [
        {
            icon: RemoveRedEye,
            onClick: (event, rowData) => {
                console.log(rowData);
                openModalUserDataInfoCleint(rowData);
            },
            tooltip: 'Ver solicitud',
        },
        {
            icon: PaidIcon,
            onClick: (event, rowData) => {
                openModalPaymentClient(rowData);
            },
            tooltip: 'Aprobar/Cancelar',
        },
    ];

    const StyledCard = styled(Card)(({ theme }) => ({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px !important',
        background: theme.palette.background.paper,
        [theme.breakpoints.down('sm')]: { padding: '16px !important' },
    }));

    const ContentBox = styled(Box)(({ theme }) => ({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '& small': { color: theme.palette.text.secondary },
        '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
    }));

    const Heading = styled('h6')(({ theme }) => ({
        margin: 0,
        marginTop: '4px',
        fontSize: '14px',
        fontWeight: '500',
        color: theme.palette.primary.main,
    }));


    return (
        <Grid className=" container">
            <Grid container justifyContent={'center'} spacing={4}>
                <Grid item md={3} sm={12} xs={12}>
                    <Card
                        sx={{ maxWidth: '100%', textAlign: 'center', justifyContent: 'center' }}
                        className="mt-3"
                    >
                        <Typography
                            fontSize={'20px'}
                            padding={'2px'}
                            textAlign={'center'}
                            marginTop={3}
                            gutterBottom
                            variant="h5"
                            component="div"
                        >
                            {users.fullName}
                        </Typography>
                        <Grid
                            display={'flex'}
                            sx={{
                                margin: '0 auto',
                            }}
                            alignContent={'center'}
                            justifyContent={'center'}
                        >
                            <CardMedia
                                component="img"
                                alt="green iguana"
                                height="125"
                                className="card-user-perfil"
                                image={!users.avatar && IMG_AVATAR}
                                src={users.avatar && `${BASE_URL_PROD}/user/photo/${users.avatar}`}
                                sx={{ height: '178px' }}
                            />
                        </Grid>
                        <CardContent></CardContent>
                        {/* <CardActions style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                            <ButtonAction
                                title={'Cambiar Avatar'}
                                classNameButon={'button-maim'}
                                size={'sm'}
                                handle={toggleModalAvatar}
                            />
                        </CardActions> */}
                    </Card>
                </Grid>
                <Grid item md={3} sm={12} xs={12} style={{ cursor: 'pointer' }}>
                    <Card
                        sx={{ maxWidth: '100%', textAlign: 'center', justifyContent: 'center' }}
                        className="mt-3"
                        onClick={cantDeposits > 0 ? () => mapDepositsClient('deposits') : false}
                    >
                        <Typography
                            fontSize={'20px'}
                            padding={'2px'}
                            textAlign={'center'}
                            marginTop={3}
                            gutterBottom
                            variant="h5"
                            component="div"
                        >
                            Depósitos
                        </Typography>
                        <hr className="hr-card-notification" />
                        <Grid item display={'flex'} justifyContent={'center'}>
                            <CardContent style={{ marginLeft: '-15px' }} width={100}>
                                <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                                    <Paragraph sx={{ m: 0 }}>
                                        Cantidad Depósitos
                                        <Badge
                                            style={{ marginLeft: '28px' }}
                                            color="secondary"
                                            badgeContent={cantDeposits ? cantDeposits : ' 0'}
                                        ></Badge>
                                    </Paragraph>
                                    {/* <Small sx={{ color: secondary }}>{notification.subtitle}</Small> */}
                                </Box>
                            </CardContent>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item md={3} sm={12} xs={12} style={{ cursor: 'pointer' }}>
                    <Card
                        sx={{ maxWidth: '100%', textAlign: 'center', justifyContent: 'center' }}
                        className="mt-3"
                        onClick={cantExpenses > 0 ? () => mapDepositsClient('expenses') : false}
                    >
                        <Typography
                            fontSize={'20px'}
                            padding={'2px'}
                            textAlign={'center'}
                            marginTop={3}
                            gutterBottom
                            variant="h5"
                            component="div"
                        >
                            Retiros
                        </Typography>
                        <hr className="hr-card-notification" />
                        <Grid item display={'flex'} justifyContent={'center'}>
                            <CardContent>
                                <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                                    <Paragraph sx={{ m: 0 }}>
                                        Cantidad Retiros
                                        <Badge
                                            style={{ marginLeft: '40px' }}
                                            color="secondary"
                                            badgeContent={cantExpenses ? cantExpenses : '0'}
                                        ></Badge>
                                    </Paragraph>
                                    {/* <Small sx={{ color: secondary }}>{notification.subtitle}</Small> */}
                                </Box>
                            </CardContent>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            <Grid>
                {loading &&
                    < Grid className='mt-2'>
                        {<LoadingSpinner />}
                    </Grid>
                }
            </Grid>
            {newData.length > 0 && flag &&
                (<Grid className="mb-2" md={12} sm={12} xs={12}>

                    <DataTable
                        title={operationData.idExpenses ? 'Retiros' : 'Depósitos'}
                        columns={columns}
                        // newData={!isLoading ? JSON.parse(JSON.stringify(users)) : []}
                        newData={!isLoading ? JSON.parse(JSON.stringify(newData ? newData : null)) : []}
                        // newData={[]}
                        size={4}
                        actions={actions}
                        mtToolbar={null}
                    />
                </Grid>
                )}
            {/* Componente Loading */}
            {isLoading && <Loading />}
            {/* Modal para ver el detalle de pagos y retiros del cliente */}
            <ModalUtils
                title={operationData.idExpenses ? 'Solicitud Retiro' : 'Solicitud Depósito'}
                w100Modal={'w100Modal'}
                mtop={'0px'}
                size={''}
                open={modalOperationClient}
                toggle={toggleModalOperationClient}
                handleChange={toggleModalOperationClient}
                spinner={null}
                disabled={false}
                visivilityModalFooter={true}
            >
                <Grid container>
                    <Grid container style={{ margin: '2 auto' }}>
                        <Grid item md={4} sm={12} xs={12}>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Nombre: </span>{' '}
                                {currentUser?.fullName}{' '}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Documento:</span>{' '}
                                {currentUser.documentNumber}{' '}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Tipo Documento:</span>{' '}
                                {getValueDocumentType(optionsDocumentType, currentUser.documentType)}{' '}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Telèfono:</span>{' '}
                                {currentUser.phone}{' '}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Indicativo:</span>{' '}
                                {getValueCountry(currentUser.indicative)}{' '}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Email:</span>{' '}
                                {currentUser.email}{' '}
                            </Typography>
                        </Grid>
                        {operationData?.idExpenses && operationData?.idExpenses && (
                            <Grid item md={4} sm={12} xs={12}>
                                <Typography style={{ fontSize: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Cuenta Clabe: </span>{' '}
                                    {operationData.keyAccount}{' '}
                                </Typography>
                                <Typography style={{ fontSize: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Código Swift: </span>{' '}
                                    {operationData.swiftCode}{' '}
                                </Typography>
                                <Typography style={{ fontSize: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Banco: </span>{' '}
                                    {getValueBank(operationData.bank)}{' '}
                                </Typography>
                                <Typography
                                    className="badge badge-pill badge-warning"
                                    style={{ fontSize: '10px', background: 'rgb(236, 171, 15)', color: 'white' }}
                                >
                                    <span style={{ fontWeight: 'bold', fontSize: '12px' }}>
                                        Monto: {formatPrice(operationData.amount)}{' '}
                                    </span>
                                </Typography>
                                <Typography style={{ fontSize: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Fecha: </span>{' '}
                                    {operationData.depositDate}{' '}
                                </Typography>
                                <Typography style={{ fontSize: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Hora: </span>{' '}
                                    {operationData.hour}{' '}
                                </Typography>
                                <span
                                    className="mt-1"
                                    style={{ display: 'flex', fontWeight: 'bold', fontSize: '15px' }}
                                >
                                    Estado:{' '}
                                    {validState(
                                        operationData.state,
                                        { width: '40%', paddingLeft: '2px', paddingRight: '2px', textAlign: 'center' },
                                        { marginLeft: '2px' }
                                    )}
                                </span>
                            </Grid>
                        )}
                        {operationData?.idDeposit && operationData?.idDeposit && (
                            <Grid item md={4} sm={12} xs={12}>
                                <Typography style={{ fontSize: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                                        Número tarjeta: {cardUser.cardNumber}{' '}
                                    </span>{' '}
                                    {operationData.keyAccount}{' '}
                                </Typography>
                                <Typography style={{ fontSize: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Año Expiración: </span>{' '}
                                    {cardUser.expYear}{' '}
                                </Typography>
                                <Typography style={{ fontSize: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Mes Expiración: </span>{' '}
                                    {cardUser.month}{' '}
                                </Typography>
                                <Typography style={{ fontSize: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>CVV: </span> {cardUser.cvv}{' '}
                                </Typography>
                            </Grid>
                        )}
                        <Grid item md={4} sm={12} xs={12}>
                            {operationData?.idExpenses && operationData?.idExpenses && (
                                <Grid>
                                    <Typography style={{ fontSize: '15px' }} className="text-center">
                                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Saldo en cuenta</span>
                                    </Typography>
                                    <StyledCard elevation={6}>
                                        <ContentBox style={{ margin: '20px' }}>
                                            <Icon style={{ color: 'rgb(236, 171, 15)' }} className="icon">
                                                attach_money
                                            </Icon>
                                            <Box ml="12px">
                                                <Small>{''}</Small>
                                                <Heading
                                                    style={{
                                                        color: 'rgb(236, 171, 15)',
                                                        marginLeft: '-13px',
                                                        fontSize: '37px',
                                                    }}
                                                >
                                                    {operationData?.idExpenses
                                                        ? formatPrice(currentUser?.balance).replace('$', '')
                                                        : 0}
                                                    <span style={{ color: 'black', fontSize: '10px', marginLeft: '2px' }}>
                                                        (€)
                                                    </span>
                                                </Heading>
                                            </Box>
                                        </ContentBox>
                                    </StyledCard>
                                </Grid>
                            )}
                            {operationData?.idDeposit && operationData?.idDeposit && (
                                <Grid>
                                    <Typography style={{ fontSize: '15px' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Fecha: </span>{' '}
                                        {operationData.depositDate}{' '}
                                    </Typography>
                                    <Typography style={{ fontSize: '15px' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Hora: </span>{' '}
                                        {operationData.hour}{' '}
                                    </Typography>
                                    <span
                                        className="mt-1"
                                        style={{ display: 'flex', fontWeight: 'bold', fontSize: '15px' }}
                                    >
                                        Estado:{' '}
                                        {validState(
                                            operationData.state,
                                            {
                                                width: '100%',
                                                paddingLeft: '2px',
                                                paddingRight: '2px',
                                                textAlign: 'center',
                                            },
                                            { marginLeft: '2px' }
                                        )}
                                    </span>
                                    <Typography
                                        className="badge badge-pill badge-warning"
                                        style={{ fontSize: '10px', background: 'rgb(236, 171, 15)', color: 'white' }}
                                    >
                                        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>
                                            Monto: {formatPrice(operationData.amount).replace('$', '€')}{' '}
                                        </span>
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </ModalUtils>
            {/* Modal para autorizar pagos y retiros de los clientes */}
            <ModalUtils
                title={operationData.idExpenses ? 'Solicitud Retiro' : 'Solicitud Depósito'}
                w100Modal={'w50Modal'}
                mtop={'0px'}
                size={''}
                open={modalPaymentClient}
                toggle={openModalUserDataInfo}
                handleChange={paymentFormik.handleSubmit}
                spinner={spinner}
                disabled={false}
                visivilityModalFooter={true}
            >
                <Grid container spacing={1}>
                    <Grid item md={6} sm={12} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="amount">Cantidad (€)</Label>
                                <NumberFormat
                                    customInput={Input}
                                    isNumericString={true}
                                    thousandSeparator={true}
                                    id="amount"
                                    name="amount"
                                    // prefix="$"
                                    placeholder="Ingrese la cantidad a pagar"
                                    onChange={(e) =>
                                        paymentFormik.setFieldValue('amount', formatoPrecio(e.target.value), false)
                                    }
                                    onBlur={paymentFormik.handleBlur}
                                    value={paymentFormik.values.amount}
                                    className="inputGlobal"
                                />
                                <div className="bg-red-100 border-l-4">
                                    <p className="mb-0">
                                        {paymentFormik.touched.amount && paymentFormik.errors.amount}
                                    </p>
                                </div>
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="bank">Estado Pago</Label>
                                <SelectComponent
                                    optionsValues={statePayment}
                                    valueOp={paymentFormik.values.state}
                                    handle={onChangeStatePayment}
                                    onBlurFn={onBlurPaymentState}
                                    placeHolder="Seleccione el estado del pago"
                                    name="state"
                                    styles={stylesSelect}
                                    theme={themeSelect}
                                />
                                <div className="bg-red-100 border-l-4">
                                    <p className="mb-0">
                                        {paymentFormik.touched.state && paymentFormik.errors.state}
                                    </p>
                                </div>
                            </FormGroup>
                        </Form>
                    </Grid>
                </Grid>
                {paymentFormik.values.state === 2 && (
                    <Grid Grid item md={12} xs={12} lg={12}>
                        <Form>
                            <FormGroup>
                                <Label for="description">Descripción</Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    disabled={false}
                                    placeholder="Ingrese la descripción"
                                    onChange={paymentFormik.handleChange}
                                    onBlur={paymentFormik.handleBlur}
                                    value={paymentFormik.values.description}
                                    className="inputGlobal"
                                />
                                {paymentFormik.touched.description && paymentFormik.errors.description && (
                                    <div className="bg-red-500 border-l-4">
                                        <p style={{ color: 'white', padding: 3 }}>
                                            {paymentFormik.touched.description && paymentFormik.errors.description}
                                        </p>
                                    </div>
                                )}
                            </FormGroup>
                        </Form>
                    </Grid>
                )}
            </ModalUtils>
        </Grid>
    );
};

export default React.memo(NotificationsPayments);
