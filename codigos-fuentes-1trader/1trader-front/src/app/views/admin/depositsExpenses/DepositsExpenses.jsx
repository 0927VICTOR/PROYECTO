import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _, { forEach, forIn } from 'lodash';
import { Box, Card, FormGroup, Grid, Icon, Typography } from '@mui/material';
import { Small } from 'app/components/Typography.js';
import styled from '@emotion/styled';
import { Form, Input, Label } from 'reactstrap';
import NumberFormat from 'react-number-format';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { initiateSocket } from '../../../services/socket'
//Slices
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

import PaidIcon from '@mui/icons-material/Paid';

import { ModalUtils } from 'app/components/Modal/ModalUtil';
// Context
import useAuth from 'app/hooks/useAuth';
import {
    BASE_URL_DEV,
    ERRORNETWORK,
    ERROR_TRANSACTION,
    IMG_AVATAR,
    SYSTEM_NOT_AVALIBLE,
} from '../../../utils/constant.js';

import LoadingSpinner, {
    findData,
    formatPrice,
    formatoPrecio,
    generateCardToken,
    getHour,
    getValueDocumentType,
    validState,
} from 'app/utils/utils';
import { getBanks, getCountries } from 'app/services/utils.services';
import DataTable from 'app/components/DataTable/DataTable.jsx';
import Loading from 'app/components/Loading/Loading.jsx';
import WebcamCapture from 'app/components/CaptureImage/WebcamCapture.jsx';
import SelectComponent from 'app/components/select/SelectComponent.jsx';
import { initalGlobalStore } from '../../../redux/InitialGlobalStore.jsx';
import { Message } from 'app/components/Notification/Notification.jsx';
import { updateDepositsExpensesById } from 'app/slices/adminSlice/depositsExpenses/thunk.js';

let datafilters = []

const DepositsExpenses = () => {
    let i = 0
    const { user } = useAuth();

    const [spinner, setSpinner] = useState(false);

    const [chkbDeposits, setChkbDeposits] = useState({ checked: false, value: 'd', disabled: false });
    const [chkbExpenses, setChkbExpenses] = useState({ checked: false, value: 'd', disabled: false });
    const [modalOperationClient, setModalOperationClient] = useState(false);
    const [modalPaymentClient, setModalPaymentClient] = useState(false);
    const [flag, setFlag] = useState(false);
    const [operationData, setOperationData] = useState({});
    const [optionsCountries, setOptionsCountries] = useState([]);
    const [optionsClients, setOptionsClients] = useState([]);
    const [client, setClient] = useState(0);
    const [currentUser, setCurrentUser] = useState({});
    const [transactionType, setTransactionType] = useState('');
    const [banks, setOptionsBanks] = useState([]);
    const [newData, setNewData] = useState([]);
    const [depositsExpenses, setDepositsExpenses] = useState([]);
    const [copyNewData, setCopyNewData] = useState([]);
    const [cardsUser, setCardsUser] = useState([]);
    const [cardUser, setCardUser] = useState({});
    const [filterOpration, setFilterOperation] = useState('');
    const [msg, setMsg] = useState(false);
    const [loading, setLoading] = useState(false);

    const [operationType, setOperationType] = useState([
        { id: 1, operationType: 'Depósitos -- Pendientes' },
        { id: 2, operationType: 'Depósitos -- Pagados' },
        { id: 3, operationType: 'Depósitos -- Cancelados' },
        { id: 4, operationType: 'Retiros -- Pendientes' },
        { id: 5, operationType: 'Retiros -- Pagados' },
        { id: 6, operationType: 'Retiros -- Cancelados' },
    ]);

    const toggleModalOperationClient = () => {
        setModalOperationClient(!modalOperationClient);
    };

    const openModalUserDataInfo = () => {
        setModalPaymentClient(!modalPaymentClient);
    };

    const dispatch = useDispatch();

    let { users, isLoading } = useSelector((state) => state.users);
    users = _.filter(
        users,
        (userFilter) => userFilter.id !== user.id && userFilter.role !== user.role
    );

    const paymentFormik = useFormik({
        initialValues: {
            id: 0,
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
                        setTimeout(async () => {
                            await mapFiltersPayments(datafilters)
                            setLoading(false)
                        }, 3000);
                        setTimeout(async () => {
                            paymentFormik.resetForm()
                        }, 3000);
                        setSpinner(false)
                        setFlag(true)
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

    let optionsOperationType = operationType.map((el, index) => {
        return {
            value: el.id,
            label: el.operationType,
        };
    });

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

    let optionsDocumentType = documentType.map((el, index) => {
        return {
            value: el.id,
            label: el.documentType,
        };
    });

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
            render: (rowData) => validState(rowData.state, 'w100'),
            cellStyle: {
                textAlign: 'center',
                fontSize: 13,
            },
            headerStyle: {
                textAlign: 'center',
            },
        },
    ];



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
        if (depositsExpenses.length > 0) {
            let filterData = _.filter(depositsExpenses, x => x.id == paymentFormik.values.id)
            setNewFilterDepositsExpenses(filterData)
        }
    }, [depositsExpenses]);

    const setNewFilterDepositsExpenses = (filterData) => {
        datafilters = [...filterData]
    }

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

    const getValueCountry = (idCountry) => {
        if (idCountry) {
            return _.find(optionsCountries, { value: parseInt(idCountry) })?.label || '';
        } else {
            return '';
        }
    };

    const getValueBank = (filter) => {
        return findData(banks, { value: filter })?.label || '';
    };

    const mapDepositsExpenses = async (depositsExpenses, cli = null) => {
        let copyData = []
        copyData = [...newData]
        let dataDepositExpenses = [];
        setNewData([]);
        if (Object.keys(depositsExpenses).length > 0) {
            // Parseamos la data original para poder acceder a sus atributos
            let data = JSON.stringify(depositsExpenses);
            let newData = JSON.parse(data);
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
                    // console.log(depositsExpenses?.account_?.balance, newData?.account_?.balance);
                    setCurrentUser({ ...userData });
                }
            }
            _.mapValues(newData, (el) => {
                setChkbDeposits({ checked: false });
                setChkbExpenses({ checked: false });
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
                    if (cursor?.deposits?.length > 0 && cursor?.expenses?.length > 0) {
                        dataDepositExpenses = [...cursor?.expenses, ...cursor?.deposits];
                    }
                    if (cursor?.deposits?.length > 0 && cursor?.expenses?.length === 0) {
                        dataDepositExpenses = [...cursor?.deposits];
                        // console.log('value id ', cli == el.id, cursor?.deposits);
                    }
                    if (cursor?.expenses?.length > 0 && cursor?.deposits?.length === 0) {
                        dataDepositExpenses = [...cursor?.expenses];
                    }
                }
                if (dataDepositExpenses.length > 0) {
                    // console.log('ID : ', cli, '---Si hay datos---', dataDepositExpenses, msg);
                    setTimeout(() => {
                        setLoading(false)
                        setMsg(false)
                        setNewData(dataDepositExpenses)
                    }, 3000)
                }
                else {
                    setTimeout(() => {
                        setLoading(false)
                        dataDepositExpenses.length > 0 ? setMsg(false) : setMsg(true)
                    }, 2000)
                    depositsExpenses = []
                    // console.log('---No hay datos---');
                }
            });
        }
    };

    const mapChangeData = (operationType, cli) => {
        setFlag(false)
        setCopyNewData([])
        let copyData = []
        let filterData = []
        let data
        copyData = [...newData]

        filterData = _.filter(depositsExpenses, x => x.id == cli)
        if (filterData.length > 0) {
            data = _.mapValues(filterData, (el) => {
                // Mapeos filter depositos
                if (operationType == 1) {
                    console.log(el.account_.deposits);
                    if (el.account_.deposits.length > 0) {
                        let dat = _.filter(el.account_.deposits, d => d.state == 0)
                        return dat
                    }
                }
                if (operationType == 2) {
                    if (el.account_.deposits.length > 0) {
                        let dat = _.filter(el.account_.deposits, d => d.state == 1)
                        return dat
                    }
                }
                if (operationType == 3) {
                    if (el.account_.deposits.length > 0) {
                        let dat = _.filter(el.account_.deposits, d => d.state == 2)
                        return dat
                    }
                }
                // Fin mapeos filter depositos
                // Mapeos filter retiros
                if (operationType == 4) {
                    if (el.account_.expenses.length > 0) {
                        let dat = _.filter(el.account_.expenses, d => d.state == 0)
                        return dat
                    }
                }
            })
        }
        if (data[0] === undefined) {
            setNewData(copyData)
        }
        else if (data[0].length > 0) {
            setNewData(data[0])
        }
        else {
            setNewData(copyData)
        }
    }

    const mapFiltersPayments = async (dataFilters) => {
        let copyData = []
        let filterData = []
        let data = []
        if (operationData.idExpenses) {
            let expenses = dataFilters[0]?.account_?.expenses
            data = expenses?.filter(x => x.state == 1)
        }
        else {
            let deposits = dataFilters[0]?.account_?.deposits
            data = deposits?.filter(x => x.state == 1)
        }
        if (data === undefined) {
            setNewData(copyData)
        }
        else if (data.length > 0) {
            console.log(data);
            console.log(data[0]);
            setCopyNewData(data)
            setFlag(true)
        }
        else {
            setNewData(copyData)
            setFlag(false)
        }
    }

    useEffect(() => {
        const socket = initiateSocket()
        socket.on('deposits-expenses', ({ depositsExpenses: data }) => {
            if (data.length > 0) {
                // console.log('Holaaa ', data);
                setDepositsExpenses(data)
            }
            return () => initiateSocket().close();
        })
        return () => initiateSocket().close();
    }, [])


    let actions = [
        {
            icon: RemoveRedEye,
            onClick: (event, rowData) => {
                openModalUserDataInfoCleint(rowData);
            },
            tooltip: 'Ver solicitud',
        },
        {
            icon: PaidIcon,
            onClick: (event, rowData) => {
                if (rowData.state === 0) {
                    openModalPaymentClient(rowData);
                }
            },
            tooltip: 'Aprobar/Cancelar',
        },
    ];

    const openModalUserDataInfoCleint = (row) => {
        if (row.idDeposit && cardsUser?.length > 0) {
            setCardUser(getCardDeposit(row.idCard));
        }
        setOperationData(row);
        setModalOperationClient(true);
    };

    const openModalPaymentClient = (row) => {
        setOperationData(row);
        paymentFormik.values.amount = row.amount
        setModalPaymentClient(true);
    };

    const onChangeStateOprationType = (value) => {
        setFilterOperation(value);
        mapChangeData(value, client)
    };


    const onChangeStatePayment = (value) => {
        // console.log('Mostrando valor : ', value);
        // let bank = _.find(banks, (bank => bank.id == value))
        paymentFormik.setFieldValue('state', value);
    };

    const getCardDeposit = (idCard) => {
        let card = _.find(cardsUser, { idCard: idCard });
        return card;
    };

    const onBlurPaymentState = (e) => {
        paymentFormik.touched.state = false;
    };

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

    const onChangeClient = async (value) => {
        setLoading(true)
        setFlag(false)
        setMsg(false)
        setFilterOperation('')
        setChkbDeposits({ checked: false });
        setChkbExpenses({ checked: false });
        setClient(value);
        setCopyNewData([]);
        setNewData([]);
        paymentFormik.setFieldValue('id', value)
        if (depositsExpenses.length > 0 && depositsExpenses !== undefined) {
            mapDepositsExpenses(depositsExpenses, value);
        }
    };

    const onBlurFullName = (e) => {
        return true;
    };

    const stylesSelect = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? 'solid #ced4da' : 'solid #ced4da',
            border: !state.isFocused ? 'solid #ced4da' : 'solid #ced4da',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            color: 'black',
        }),
        option: (baseStyles) => ({
            ...baseStyles,
            cursor: 'pointer',
        }),
        singleValue: (baseStyles) => ({
            ...baseStyles,
            color: 'black'
        }),
        input: (baseStyles) => ({
            ...baseStyles,
            color: 'black',
        }),
        menu: (baseStyles) => ({
            ...baseStyles,
            minHeight: '90px',
        }),
    };

    const themeSelect = (theme) => ({
        ...theme,
        borderRadius: 5,
        colors: {
            ...theme.colors,
            primary25: '#b2b6d4',
            primary: '#111128',
        },
    });

    return (
        <Grid className="container">
            <Grid className="mt-4">
                <Grid container spacing={2}>
                    <Grid item md={6} sm={12} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="fullName">Selecione el cliente</Label>
                                <SelectComponent
                                    optionsValues={users.map((el) => {
                                        if (users.length > 0) {
                                            return {
                                                value: el.id,
                                                label: el.fullName,
                                            };
                                        }
                                    })}
                                    valueOp={client}
                                    handle={onChangeClient}
                                    onBlurFn={onBlurFullName}
                                    placeHolder="Nombre Cliente"
                                    name="fullName"
                                    loading={isLoading}
                                    styles={stylesSelect}
                                    theme={themeSelect}
                                    calssNameSelect={'z-index-select-find-client'}
                                />
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="bank">Filtro</Label>
                                <SelectComponent
                                    optionsValues={optionsOperationType}
                                    valueOp={filterOpration}
                                    handle={onChangeStateOprationType}
                                    onBlurFn={null}
                                    placeHolder="Filtro busqueda"
                                    name="state"
                                    disabled={newData?.length > 0 ? false : true}
                                    styles={stylesSelect}
                                    theme={themeSelect}
                                    calssNameSelect={'z-index-select-find-user'}
                                />
                            </FormGroup>
                        </Form>
                    </Grid>
                </Grid>
            </Grid>
            {flag == false ? (
                <Grid className="mb-2">
                    {loading &&
                        < Grid className='mt-2'>
                            {<LoadingSpinner />}
                        </Grid>
                    }
                    {
                        msg &&
                        < Grid className='mt-2'>
                            <span>No se encontraron datos.</span>
                        </Grid>
                    }
                    {newData.length > 0 && <DataTable
                        title="Usuarios"
                        columns={columns}
                        // newData={!isLoading ? JSON.parse(JSON.stringify(users)) : []}
                        newData={!isLoading ? JSON.parse(JSON.stringify(newData ? newData : null)) : []}
                        size={4}
                        actions={actions}
                        mtToolbar={null}
                    />}
                </Grid>) :
                (
                    <Grid className="mb-2">
                        {loading &&
                            < Grid className='mt-2'>
                                {<LoadingSpinner />}
                            </Grid>
                        }
                        {copyNewData.length > 0 && <DataTable
                            title="Usuarios"
                            columns={columns}
                            // newData={!isLoading ? JSON.parse(JSON.stringify(users)) : []}
                            newData={!isLoading ? JSON.parse(JSON.stringify(copyNewData ? copyNewData : null)) : []}
                            size={4}
                            actions={actions}
                            mtToolbar={null}
                        />}
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
                handleChange={null}
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
                                <span
                                    className="mt-1"
                                    style={{ display: 'flex', fontWeight: 'bold', fontSize: '15px' }}
                                >
                                    Estado:{' '}
                                    {validState(
                                        operationData.state,
                                        { width: '100%', paddingLeft: '2px', paddingRight: '2px', textAlign: 'center' },
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
                            <FormGroup className="mb-4">
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
                                <Label for="state">Estado Pago</Label>
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

export default DepositsExpenses;
