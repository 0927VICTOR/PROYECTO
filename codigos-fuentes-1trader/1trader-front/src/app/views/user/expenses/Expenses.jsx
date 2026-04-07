import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Card, Grid, Icon, Typography, styled } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import _ from 'lodash'
import NumberFormat from "react-number-format";
import { MTableToolbar } from 'material-table';

import Loading from 'app/components/Loading/Loading';
import { createExpense, getExpenseById } from 'app/slices/userSlice/expenses';
import { findData, formatoPrecio, formatPrice, getHour, validState } from '../../../utils/utils'
import { ModalUtils } from '../../../components/Modal/ModalUtil'
import ButtonAction from 'app/components/Button/ButtonAction';
import { Message } from 'app/components/Notification/Notification';
import DataTable from 'app/components/DataTable/DataTable';
import useAuth from 'app/hooks/useAuth';
import { ERRORNETWORK } from 'app/utils/constant';
import { getUserById } from 'app/slices/userSlice/users';
import SelectComponent from 'app/components/select/SelectComponent';
import { getBanks } from 'app/services/utils.services';
import { Small } from 'app/components/Typography';

const Expenses = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAuth()

    let { expenses, isLoading } = useSelector((state) => state.expenses);
    let { users } = useSelector((state) => state.users);

    expenses = _.filter(expenses, (userExpense) => userExpense?.account_idaccount == user['account_']?.idAccount)
    const [modal, setModal] = useState(false)
    const [modalConfirm, setModalConfirm] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [loading, setLoading] = useState(false)
    const [banks, setOptionsBanks] = useState([]);

    const toggle = () => {
        setModal(!modal)
        initChargerData()
        //limpiarCampos()
    };

    const toggleModalConfirm = () => {
        setModalConfirm(!modalConfirm)
    };

    const expenseFormik = useFormik({
        initialValues: {
            id: '',
            fullName: '',
            email: '',
            bank: '0',
            keyAccount: '0',
            amount: "",
            swiftCode: '',
            expenseDate: null,
            balance: 0
        },
        validationSchema: Yup.object({
            // depositDate: Yup.date()
            //     .required('La fecha es requerida')
            //     .nullable(false)
            //     .default(undefined)
            //     .typeError('Fecha Inválida'),
            bank: Yup.number()
                .required('Este campo es requerido'),
            keyAccount: Yup.number()
                .required('Este campo es requerido')
                .max(100000000, "To big")
                .min(0, "No se admiten números negativos")
                .positive('Solo se admiten números mayores a 0'),
            amount: Yup.number()
                .required('Este campo es requerido')
                .positive('Solo se admiten números mayores a 0'),
            swiftCode: Yup.string()
                .required('Este campo es requerido'),
            // description: Yup.string()
            //     .required('Este campo es requerido'),
        }),
        onSubmit: () => {
            if (expenseFormik.isValid) {
                let values = expenseFormik.values;
                let data = {
                    user: {
                        id: user.id,
                        fullName: values.fullName,
                        email: values.email
                    },
                    expenses: {
                        depositDate: moment().format('YYYY/MM/DD'),
                        bank: values.bank,
                        keyAccount: values.keyAccount,
                        amount: values.amount,
                        swiftCode: values.swiftCode,
                        amount: values.amount,
                        termAndConditions: values.termAndConditions,
                        hour: getHour().toString()
                    }
                }
                setSpinner(true)
                toggleModalConfirm()
                dispatch(createExpense(data, (error) => {
                    console.log('Mostrando el error ', error);
                    if (error === false) {
                        Message('success', 'Retiro', 'Tu solicitud se encuentra en proceso.')
                        expenseFormik.resetForm()
                        setModal(false)
                        setSpinner(false)
                        setLoading(false)
                    }
                    else if (error.message === ERRORNETWORK) {
                        Message('error', 'Retiro', 'Lo sentimos el sistema no esta diponible en estos momentos.')
                        expenseFormik.resetForm()
                        setModal(false)
                        setSpinner(false)
                        setLoading(false)
                    }
                    else {
                        Message('error', 'Retiro', 'No sa ha podido relizar esta transacción.')
                        expenseFormik.resetForm()
                        setModal(false)
                        setSpinner(false)
                        toggleModalConfirm()
                        setLoading(false)
                    }
                }))
            }
        }
    })

    const saveExpense = () => {

    }

    const columns = [
        {
            title: "Fecha",
            field: "expensesDate",
            cellStyle: {
                fontSize: 13,
                textAlign: 'center'
            },
            headerStyle: {
                alignItems: 'center',
                fontSize: 13,
                textAlign: 'center'
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
            title: 'Retiro (€)',
            field: 'amount',
            render: (rowData) => {
                let p = formatPrice(rowData.amount)
                return p.replace('$', '€')
            },
            cellStyle: {
                textAlign: "center",
                fontSize: 13,

            },
            headerStyle: {
                textAlign: "center",

            }
        },
        {
            title: 'Estado',
            field: 'state',
            render: (rowData) => validState(rowData.state),
            cellStyle: {
                textAlign: "center",
                fontSize: 13,

            },
            headerStyle: {
                textAlign: "center",

            }
        },
    ]

    const StyledCard = styled(Card)(({ theme }) => ({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px !important',
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


    const renderMtableToolbar = (props) => {
        return (
            <div>
                <Typography>Saldo en cuenta</Typography>
                <StyledCard elevation={5}>
                    <ContentBox>
                        <Icon style={{ color: 'rgb(236, 171, 15)' }} className="icon" >attach_money</Icon>
                        <Box ml="12px">
                            <Small>{''}</Small>
                            <Heading style={{ color: 'rgb(236, 171, 15)', marginLeft: '-13px', fontSize: '18px' }}>
                                {users[0]?.account_?.balance ? formatPrice(users[0]?.account_?.balance).replace('$', '') : 0}
                                <span style={{ color: 'black', fontSize: '10px', marginLeft: '2px' }}>(€)</span>
                            </Heading>
                        </Box>
                    </ContentBox>

                    {/* <Tooltip title="View Details" placement="top">
                            <IconButton>
                                <Icon>arrow_right_alt</Icon>
                            </IconButton>
                        </Tooltip> */}
                </StyledCard>
            </div>
        )
    }


    useEffect(() => {
        console.log('falta validar el error al listar retitros');
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            initChargerData()
        }
    }, [users]);

    useEffect(async () => {
        setLoading(await isLoading)
    }, [isLoading]);

    useEffect(async () => {
        let data
        let banks = await getBanks()
        if (banks.length > 0) {
            data = banks.map(el => {
                return {
                    value: el.idBank,
                    // label: renderHTML(el.ESPANOL, el.PHONE_CODE)
                    label: el.name
                };
            })
        }
        setOptionsBanks(data)
    }, []);

    const handleRedirectBalanceHistory = () => {
        navigate(`/customer/account/balance/${1}`)
    }

    const initChargerData = () => {
        if (users !== undefined) {
            if (Object.keys(users).length > 0) {
                let u = findData(users, { id: user.id })
                // console.log(u);
                expenseFormik.setFieldValue('id', u.idUser)
                expenseFormik.setFieldValue('fullName', u.fullName)
                expenseFormik.setFieldValue('email', u.email)
                expenseFormik.setFieldValue('balance', u?.account_?.balance)
            }
        }
    }

    const onChangeBank = (value) => {
        let bank = _.find(banks, (bank => bank.id == value))
        expenseFormik.setFieldValue('bank', bank.bank)
    }

    const handleOnChangeBank = (value) => {
        console.log('Mostrando valor : ', value);
        // let bank = _.find(banks, (bank => bank.id == value))
        expenseFormik.setFieldValue('bank', value)
    }

    const onBlurBank = (e) => {
        expenseFormik.touched.bank = true
    }

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
            fontSize: '14px'
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


    return (
        <Grid className=' container'>
            <Grid item sm={12} md={4} xs={12} className='mt-2'>
                <ButtonAction
                    classNameButon={'button-maim'}
                    handle={toggle}
                    title={'Retiros'} size={'sm'}
                    fontIcon={<FontAwesomeIcon
                        style={{ marginRight: '2px' }}
                        icon={faWallet}
                    />}
                />
            </Grid>
            <Grid item container display={'flex'} justifyContent={'center'}>
                <Grid textAlign={'center'} md={2} sm={5} xs={12}>
                    <Typography>Saldo en cuenta</Typography>
                    <StyledCard elevation={12}>
                        <ContentBox>
                            <Icon style={{ color: 'rgb(236, 171, 15)' }} className="icon" >attach_money</Icon>
                            <Box ml="12px">
                                <Small>{''}</Small>
                                <Heading style={{ color: 'rgb(236, 171, 15)', marginLeft: '-13px', fontSize: '18px' }}>
                                    {expenseFormik?.values?.balance ? formatPrice(expenseFormik?.values?.balance).replace('$', '') : 0}
                                    <span style={{ color: 'black', fontSize: '10px', marginLeft: '2px' }}>(€)</span>
                                </Heading>
                            </Box>
                        </ContentBox>

                        {/* <Tooltip title="View Details" placement="top">
                            <IconButton>
                                <Icon>arrow_right_alt</Icon>
                            </IconButton>
                        </Tooltip> */}
                    </StyledCard>
                </Grid>
            </Grid>
            <Grid className='mb-2' >
                <DataTable
                    title='Retiros'
                    columns={columns}
                    newData={!isLoading ? JSON.parse(JSON.stringify(expenses ? expenses : null)) : []}
                    size={4}
                    mtToolbar={null}
                />
            </Grid>
            {/* Modal personalizado para solicitar depositos */}
            <ModalUtils
                title='Solicitud retiro'
                w100Modal={"w100Modal"}
                mtop={'0px'}
                size={''}
                open={modal}
                toggle={toggle}
                handleChange={expenseFormik.handleSubmit}
                spinner={spinner}
                disabled={false}
                visivilityModalFooter={true}
            >
                <Grid container spacing={2}>
                    <Grid item md={6} sm={2} xs={12} >
                        <Form >
                            <FormGroup>
                                <Label for="id">ID</Label>
                                <Input
                                    type="text"
                                    name="id"
                                    onChange={expenseFormik.handleChange}
                                    onBlur={expenseFormik.handleBlur}
                                    value={expenseFormik.values.id}
                                    disabled={true}
                                    className='inputGlobal'
                                />
                                <div className="bg-red-100 border-l-4">
                                    <p className='mb-0'>{expenseFormik.touched.id && expenseFormik.errors.id}</p>
                                </div>
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12} >
                        <Form>
                            <FormGroup>
                                <Label for="fullName">Nombre completo</Label>
                                <Input
                                    type="text"
                                    name="fullName"
                                    id="nombre"
                                    placeholder="Ingrese su nombre completo"
                                    onChange={expenseFormik.handleChange}
                                    onBlur={expenseFormik.handleBlur}
                                    value={expenseFormik.values.fullName}
                                    className='inputGlobal'
                                />
                                {expenseFormik.touched.fullName && expenseFormik.errors.fullName && <div className="bg-red-500 border-l-4">
                                    <p style={{ color: 'white', padding: 3 }}>{expenseFormik.touched.fullName && expenseFormik.errors.fullName}</p>
                                </div>}
                            </FormGroup>
                        </Form>
                    </Grid>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <Form>
                        <FormGroup>
                            <Label for="email">E-mail</Label>
                            <Input
                                type="text"
                                name="email"
                                id="email"
                                disabled={true}
                                placeholder="Ingrese la dirección de email"
                                onChange={expenseFormik.handleChange}
                                onBlur={expenseFormik.handleBlur}
                                value={expenseFormik.values.email}
                                className='inputGlobal'
                            />
                            {expenseFormik.touched.email && expenseFormik.errors.email && <div className="bg-red-500 border-l-4">
                                <p style={{ color: 'white', padding: 3 }}>{expenseFormik.touched.email && expenseFormik.errors.email}</p>
                            </div>}
                        </FormGroup>
                    </Form>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md={6} sm={12} xs={12}>
                        <Form>
                            <FormGroup >
                                <Label for="bank">Banco</Label>
                                <SelectComponent
                                    optionsValues={banks}
                                    valueOp={expenseFormik.values.bank}
                                    handle={handleOnChangeBank}
                                    onBlurFn={onBlurBank}
                                    placeHolder='Seleccione un banco'
                                    name='bank'
                                    styles={stylesSelect}
                                    theme={themeSelect}
                                />
                                <div className="bg-red-100 border-l-4">
                                    <p className="mb-0">
                                        {expenseFormik.touched.bank && expenseFormik.errors.bank}
                                    </p>
                                </div>
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12} >
                        <Form >
                            <FormGroup>
                                <Label for="keyAccount" className=''>Cuenta Clabe</Label>
                                <NumberFormat
                                    customInput={Input}
                                    isNumericString={true}
                                    thousandSeparator={false}
                                    id="keyAccount"
                                    name='keyAccount'
                                    allowNegative={false}
                                    placeholder="Ingrese la cantidad a retirar (€)"
                                    onChange={(e) => expenseFormik.setFieldValue("keyAccount", e.target.value)}
                                    onBlur={expenseFormik.handleBlur}
                                    value={expenseFormik.values.keyAccount}
                                    className='inputGlobal'
                                />
                                {expenseFormik.touched.keyAccount && expenseFormik.errors.keyAccount && <div className="bg-red-500 border-l-4">
                                    <p style={{ color: 'black', padding: 3 }}>{expenseFormik.touched.keyAccount && expenseFormik.errors.keyAccount}</p>
                                </div>}
                            </FormGroup>
                        </Form>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md={6} sm={12} xs={12} >
                        <Form>
                            <FormGroup className="mb-4">
                                <Label for="amount">Cantidad (€)</Label>
                                <NumberFormat
                                    customInput={Input}
                                    isNumericString={true}
                                    thousandSeparator={true}
                                    id="amount"
                                    name='amount'
                                    prefix='$'
                                    placeholder="Ingrese la cantidad a retirar"
                                    onChange={(e) => expenseFormik.setFieldValue("amount", formatoPrecio(e.target.value), false)}
                                    onBlur={expenseFormik.handleBlur}
                                    value={expenseFormik.values.amount}
                                    className='inputGlobal'
                                />
                                <div className="bg-red-100 border-l-4">
                                    <p className='mb-0'>{expenseFormik.touched.amount && expenseFormik.errors.amount}</p>
                                </div>
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12} >
                        <Form >
                            <FormGroup>
                                <Label for="swiftCode" className=''>Còdigo swift</Label>
                                <Input
                                    type="text"
                                    name="swiftCode"
                                    placeholder="Ingrese el còdigo swift"
                                    onChange={expenseFormik.handleChange}
                                    onBlur={expenseFormik.handleBlur}
                                    value={expenseFormik.values.swiftCode.toUpperCase()}
                                    className='inputGlobal'
                                />
                                {expenseFormik.touched.swiftCode && expenseFormik.errors.swiftCode && <div className="bg-red-500 border-l-4">
                                    <p style={{ color: 'black', padding: 3 }}>{expenseFormik.touched.swiftCode && expenseFormik.errors.swiftCode}</p>
                                </div>}
                            </FormGroup>
                        </Form>
                    </Grid>
                </Grid>
            </ModalUtils>
            {/* Componente Loading */}
            {loading && <Loading />}
        </Grid>
    )
}


export default Expenses