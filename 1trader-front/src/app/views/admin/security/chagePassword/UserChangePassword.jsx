import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from 'file-saver'
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Accordion from '@mui/material/Accordion';

import Select from "react-select";

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaidIcon from '@mui/icons-material/Paid';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import { ModalUtils } from 'app/components/Modal/ModalUtil';

import { BASE_URL_PROD, IMG_AVATAR } from '../../../../utils/constant.js';
import useAuth from 'app/hooks/useAuth';
import { findData, formatPrice, generateCardToken, getValueDocumentType, indexData } from 'app/utils/utils';
import { getCountries } from 'app/services/utils.services';
import DataTable from 'app/components/DataTable/DataTable.jsx';
import { Box, Card, Grid, Icon, Typography } from '@mui/material';
import Loading from 'app/components/Loading/Loading.jsx';
import WebcamCapture from 'app/components/CaptureImage/WebcamCapture.jsx';
import { Small } from 'app/components/Typography.js';
import styled from '@emotion/styled';
import _ from 'lodash';

import { initiateSocket } from 'app/services/socket.jsx';
import { Link, useNavigate } from 'react-router-dom';
import SelectComponent from 'app/components/select/SelectComponent.jsx';


const UserAdminSystemChangePassword = () => {
    const { user } = useAuth();

    const [spinner, setSpinner] = useState(false);
    const [modalInfoUserClient, setModalInfoUserClient] = useState(false);
    const [modalInfoAccountVerify, setModalAccountVerify] = useState(false);
    const [userData, setUserData] = useState({});
    const [optionsCountries, setOptionsCountries] = useState([]);
    const [cardsUser, setCardsUser] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const toggleModalInfoUserClient = () => {
        setModalInfoUserClient(!modalInfoUserClient);
    };
    const toggleModalAccountVerify = () => {
        setModalAccountVerify(!modalInfoAccountVerify);
    };
    const [isValid, setIsValid] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState();

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const formikAccountVerify = useFormik({
        initialValues: {
            accountVerify: '',
            description: []
        },
        validationSchema: Yup.object({
            accountVerify: Yup.string()
                .required('Este campo es requerido'),
            // description: Yup.array()
            //     .required('Este campo es requerido'),
        }),
        onSubmit: (values) => {
            // console.log('Holaaaaaaaaaaaaaaaaa', values);
            // console.log(values.description);
            if (values.description.length > 0) {
                if (formikAccountVerify.isValid) {
                    let data = {
                        accountVerify: values.accountVerify,
                        description: values.description
                    }
                    // console.log(`Mostrando datos de los pagos ${JSON.stringify(data)}`);
                }
            } else {
                setIsValid(true)
            }
        },
    });

    // useEffect(() => {
    //     // If there is data, the form is valid
    //     setIsValid(selectedOptions?.length > 0 ? true : false);
    // }, [selectedOptions]);

    const [documentType, setDocumentType] = useState([
        { id: '1', documentType: 'CC' },
        { id: '2', documentType: 'CE' },
        { id: '3', documentType: 'PASAPORTE' },
        { id: '4', documentType: 'TI' },
    ]);

    let optionsDocumentType = documentType.map((el, index) => {
        return {
            value: el.id,
            label: el.documentType,
        };
    });

    const [accountVerifyOptions, setAccountVerifyOptions] = useState([
        { value: 1, label: 'Cuenta no verificada' },
        { value: 2, label: 'Cuenta verificada' },
    ]);

    const optionList = [
        { value: 1, label: "Falta subir los documentos" },
        { value: 2, label: "Falta completar los campos" },
    ];

    const handleSelect = (data) => {
        setSelectedOptions(data);
        formikAccountVerify.setFieldValue('description', selectedOptions)
    }

    useEffect(() => {
        const socket = initiateSocket()
        socket.on('users', ({ users }) => {
            if (users.length > 0) {
                users = _.filter(
                    users,
                    (userFilter) => userFilter.id !== user.id && userFilter.role !== user.role
                );
                // console.log('Mostrando datos usuarios : ', users);
                setUsersData(users)
            }
            return () => initiateSocket().close();
        })
        return () => initiateSocket().close();
    }, [])

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

    const columns = [
        {
            title: 'Avatar',
            field: 'avatar',
            render: (rowData) => (
                <Grid>
                    <Grid className={`active-on-off `} >
                        <Grid className={` ${rowData.statusActive == 1 ? 'active-on' : 'active-off'}`} ></Grid>
                    </Grid>
                    <img
                        alt="avatar"
                        src={
                            rowData.avatar == null || rowData.avatar == undefined || rowData.avatar == ''
                                ? `${IMG_AVATAR}`
                                : `${BASE_URL_PROD}/user/photo/${rowData.avatar}`
                        }
                        style={{ width: 60, height: 60, borderRadius: '50%' }}
                    />
                </Grid>
            ),
        },
        {
            title: 'Nombre',
            field: 'fullName',
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
            title: 'Tipo documento',
            field: 'documentType',
            render: (row) => {
                let typeDoc = _.find(documentType, { id: row?.documentType?.toString() });
                return typeDoc?.documentType;
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
            title: 'Documento',
            field: 'documentNumber',
            cellStyle: {
                textAlign: 'center',
                fontSize: 13,
            },
            headerStyle: {
                textAlign: 'center',
            },
        },
        {
            title: 'Email',
            field: 'email',
            cellStyle: {
                textAlign: 'center',
                fontSize: 13,
            },
            headerStyle: {
                textAlign: 'center',
            },
        },
        {
            title: 'Teléfono',
            field: 'phone',
            cellStyle: {
                textAlign: 'center',
                fontSize: 13,
            },
            headerStyle: {
                textAlign: 'center',
            },
        },
        {
            title: 'Indicativo',
            field: 'indicative',
            render: (row) => indexData(optionsCountries, 'value')[row.indicative]?.label,
            cellStyle: {
                textAlign: 'center',
                fontSize: 13,
            },
            headerStyle: {
                textAlign: 'center',
            },
        },
    ];

    const columnsCards = [
        {
            title: 'N. Tarjeta',
            field: 'cardNumber',
            cellStyle: {
                fontSize: 10,
                textAlign: 'center',
                width: '30px',
                width: '100px',
            },
            headerStyle: {
                alignItems: 'center',
                fontSize: 10,
                textAlign: 'center',
            },
            // render: (rowData) => formatoFecha(rowData.fecha)
        },
        {
            title: 'A.Expiración',
            field: 'expYear',
            cellStyle: {
                fontSize: 10,
                textAlign: 'center',
                width: '10px',
            },
            headerStyle: {
                alignItems: 'center',
                fontSize: 10,
                textAlign: 'center',
                width: '20px',
            },
            // render: (rowData) => formatoFecha(rowData.fecha)
        },
        {
            title: 'M. Expiración',
            field: 'month',
            cellStyle: {
                fontSize: 10,
                textAlign: 'center',
                width: '20px',
            },
            headerStyle: {
                alignItems: 'center',
                fontSize: 10,
                textAlign: 'center',
                width: '20px',
            },
            // render: (rowData) => formatoFecha(rowData.fecha)
        },
        {
            title: 'CVV',
            field: 'cvv',
            cellStyle: {
                fontSize: 10,
                textAlign: 'center',
                width: '20px',
            },
            headerStyle: {
                alignItems: 'center',
                fontSize: 10,
                textAlign: 'center',
                width: '20px',
            },
            // render: (rowData) => formatoFecha(rowData.fecha)
        },
    ];

    let actions = [
        {
            icon: RemoveRedEye,
            onClick: (event, rowData) => {
                setCardsUser([])
                let cardsUser = [];
                if (rowData?.cards?.length > 0) {
                    rowData?.cards?.forEach((el) => {
                        return cardsUser.push({
                            idCard: rowData.idCard,
                            cardNumber: generateCardToken(el.cardNumber),
                            cvv: generateCardToken(el.cvv),
                            expYear: generateCardToken(el.expYear),
                            month: generateCardToken(el.month),
                        });
                    });
                    let data = JSON.stringify(cardsUser)
                    let parseDta = JSON.parse(data)
                    setCardsUser(parseDta);
                }
                OpenModalUserDataInfo(rowData);
            },
            tooltip: 'Ver datos usuario',
        },
        {
            icon: ChecklistRtlIcon,
            onClick: (event, rowData) => {
                setModalAccountVerify(true);
            },
            tooltip: 'Verifación cuenta',
        },
        {
            icon: PaidIcon,
            onClick: (event, rowData) => {
                // if (rowData.state === 0) {
                //     // openModalPaymentClient(rowData);
                // }
                return navigate(`/admin/user/earning/payment/user/${rowData.id}?name=${rowData.fullName}`)
            },
            tooltip: 'Pagos/Ganancias',
        }
    ];

    const OpenModalUserDataInfo = (row) => {
        setUserData(row);
        setModalInfoUserClient(true);
    };


    const handeAccountVerifyOptions = (value) => {
        formikAccountVerify.setFieldValue('accountVerify', value)
    }

    const onBlurAccountVerifyOptions = (e) => {
        formikAccountVerify.touched.accountVerifyOptions = true
    }

    const onBlurdescription = (e) => {
        console.log('onBlurdescription', selectedOptions);
        if (selectedOptions?.length > 0) {
            setIsValid(false)
        } else {
            setIsValid(true)
        }
        // formikAccountVerify.touched.accountVerifyOptions = true
    }

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

    const downloadImageDocument = (type, img) => {
        if (type == 'front') {
            saveAs(`${BASE_URL_PROD}/user/photo/${img}`, `${userData.documentImagenFront}`)
        }
        else if (type == 'post') {
            saveAs(`${BASE_URL_PROD}/user/photo/${img}`, `${userData.documentImagenPost}`)
        }
    }

    const stylesSelect = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? 'solid #ced4da' : 'solid #ced4da',
            border: !state.isFocused ? 'solid #ced4da' : 'solid #ced4da',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            // height: 32,
            // minHeight: 26,
            display: 'flex',
            color: 'black',
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
            // minHeight: '90px'
        }),
        valueContainer: (baseStyles, state) => ({
            ...baseStyles,
            // height: '30px',
            marginTop: -4
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
        <Grid className=" container">
            <Grid className="mb-2">
                <DataTable
                    title="Usuarios"
                    columns={columns}
                    newData={usersData.length > 0 ? JSON.parse(JSON.stringify(usersData)) : []}
                    size={4}
                    actions={actions}
                    mtToolbar={null}
                />
            </Grid>
            {/* Componente Loading */}
            {/* {isLoading && <Loading />} */}
            {/* Modal para gestion datos usuario-cliente */}
            <ModalUtils
                title="Datos Usuario"
                w100Modal={'w100Modal'}
                mtop={'165px'}
                size={''}
                open={modalInfoUserClient}
                toggle={toggleModalInfoUserClient}
                handleChange={toggleModalInfoUserClient}
                spinner={false}
                disabled={false}
                visivilityModalFooter={true}
            >
                <Grid container display={'flex'} alignContent={'center'} style={{ marginTop: '-9px' }}>
                    <Grid item md={6} sm={12} xs={12}>
                        <Grid style={{ marginTop: '1%' }}>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Nombre:</span>{' '}
                                {userData?.fullName}{' '}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Documento:</span>{' '}
                                {userData?.documentNumber}{' '}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Tipo Documento:</span>{' '}
                                {getValueDocumentType(optionsDocumentType, userData?.documentType)}{' '}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Telèfono:</span>{' '}
                                {userData?.phone}{' '}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Indicativo:</span>{' '}
                                {getValueCountry(userData?.indicative)}{' '}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Email:</span>{' '}
                                {userData?.email}{' '}
                            </Typography>
                        </Grid>
                        <Grid item className="mt-2">
                            <Typography>Saldo cuenta</Typography>
                            <StyledCard elevation={6} style={{ width: '35%' }}>
                                <ContentBox>
                                    <Icon style={{ color: 'rgb(236, 171, 15)' }} className="icon">
                                        attach_money
                                    </Icon>
                                    <Box ml="12px">
                                        <Small>{''}</Small>
                                        <Heading
                                            style={{ color: 'rgb(236, 171, 15)', marginLeft: '-13px', fontSize: '18px' }}
                                        >
                                            {userData?.account_?.balance
                                                ? formatPrice(userData?.account_?.balance).replace('$', '')
                                                : 0}
                                            <span style={{ color: 'black', fontSize: '10px', marginLeft: '2px' }}>
                                                (€)
                                            </span>
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
                    <Grid item md={6} sm={12} xs={12}>
                        <Grid style={{ marginTop: '2px' }}>
                            {cardsUser?.length > 0 ?
                                cardsUser?.map(el => {
                                    console.log(el?.cardNumber);
                                    let card = ` *****************${el?.cardNumber?.slice(el?.cardNumber?.length - 5, el?.cardNumber?.length)}`
                                    return (
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id={`${el?.id}"panel1a-header"`}
                                            >
                                                <Typography style={{ marginLeft: '3px' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Tajeta:</span>
                                                    {` ${card}`}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography style={{ fontSize: '15px' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Número tarjeta:</span>{' '}
                                                    {el?.cardNumber}{' '}
                                                </Typography>
                                                <Typography style={{ fontSize: '15px' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Año Expiración:</span>{' '}
                                                    {el?.expYear}{' '}
                                                </Typography>
                                                <Typography style={{ fontSize: '15px' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Mes Expiración:</span>{' '}
                                                    {el?.month}{' '}
                                                </Typography>
                                                <Typography style={{ fontSize: '15px' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>CVV:</span>{' '}
                                                    {el?.cvv}{' '}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                })
                                : false}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={12} sm={12} xs={12} className="mt-2">
                    <WebcamCapture
                        imgFront={userData?.documentImagenFront}
                        imgPost={userData?.documentImagenPost}
                        imgTempFront1={null}
                        imgTempPost2={null}
                        selectedHandlerFileDocumentFront={null}
                        selectedHandlerFileDocumentPost={null}
                        hondleDownload={downloadImageDocument}
                    />
                </Grid>
            </ModalUtils>
            {/* Modal para validar la cuenta de los usuarios */}
            <ModalUtils
                title="Verificación cuenta usuario"
                w100Modal={'w50Modal'}
                mtop={'0px'}
                size={''}
                open={modalInfoAccountVerify}
                toggle={toggleModalAccountVerify}
                handleChange={formikAccountVerify.handleSubmit}
                spinner={false}
                disabled={false}
                visivilityModalFooter={true}
            >
                <Grid container>
                    <Grid item md={12} sm={12} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="accountVerify">verificación cuenta</Label>
                                <SelectComponent
                                    optionsValues={accountVerifyOptions && accountVerifyOptions}
                                    valueOp={formikAccountVerify.values.accountVerify}
                                    handle={handeAccountVerifyOptions}
                                    onBlurFn={onBlurAccountVerifyOptions}
                                    placeHolder='Estado verificación cuenta'
                                    name='accountVerify'
                                    calssNameSelect={'z-index-select'}
                                    styles={stylesSelect}
                                    theme={themeSelect}
                                />
                                <div className="bg-red-100 border-l-4">
                                    <p style={{ color: 'black', padding: 3 }} className="mb-0">
                                        {formikAccountVerify.touched.accountVerify && formikAccountVerify.errors.accountVerify}
                                    </p>
                                </div>
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="accountVerify">Descripción</Label>
                                <Select
                                    options={optionList}
                                    placeholder="Seleccione la descripción"
                                    value={selectedOptions}
                                    onChange={handleSelect}
                                    onBlur={onBlurdescription}
                                    name='description'
                                    isSearchable={true}
                                    isMulti
                                />
                            </FormGroup>
                            {isValid && <p>Este campo es requerido</p>}
                        </Form>
                    </Grid>
                </Grid>
            </ModalUtils>
        </Grid>
    );
};

export default UserAdminSystemChangePassword;
