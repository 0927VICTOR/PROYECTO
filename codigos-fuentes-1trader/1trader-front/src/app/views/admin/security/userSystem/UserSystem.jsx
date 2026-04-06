import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Accordion from '@mui/material/Accordion';

import Select from 'react-select';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyOutlined from '@mui/icons-material/KeyOutlined.js';
import Edit from '@mui/icons-material/Edit.js';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import { ModalUtils } from 'app/components/Modal/ModalUtil';

import {
    BASE_URL_DEV,
    ERRORNETWORK,
    ERROR_OPERATION,
    IMG_AVATAR,
    MAILFORMAT,
    ROL_USER,
    SYSTEM_NOT_AVALIBLE,
} from '../../../../utils/constant.js';
import useAuth from 'app/hooks/useAuth';
import {
    findData,
    formatPrice,
    generateCardToken,
    getValueDocumentType,
    indexData,
    validateEmail,
} from 'app/utils/utils';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import ButtonAction from 'app/components/Button/ButtonAction.jsx';
import { Message } from 'app/components/Notification/Notification.jsx';
import NumberFormat from 'react-number-format';
import {
    changePasswordUserSystemThunk,
    createUserSystemThunk,
    updateUserSystemThunk,
} from 'app/slices/adminSlice/userSystem/thunk.js';

const UserSystem = () => {
    const { user } = useAuth();

    const [spinner, setSpinner] = useState(false);
    const [idEdit, setIdEdit] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [modalUser, setModalInfoUser] = useState(false);
    const [modalPassword, setModalPassword] = useState(false);
    const [userData, setUserData] = useState({});
    const [optionsCountries, setOptionsCountries] = useState([]);
    const [cardsUser, setCardsUser] = useState([]);
    const toggleModalUser = () => {
        if (idEdit) {
            setIdEdit('');
            userFormik.resetForm();
        }
        setModalInfoUser(!modalUser);
    };
    const toggleModalPassword = () => {
        setModalPassword(!modalPassword);
    };
    const [isValid, setIsValid] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState();
    const [typeUserOption, setTypeUserOption] = useState([
        { value: 3, label: 'Usuario Sistema' },
        { value: 1, label: 'Administrador' },
    ]);
    let lookup = { Admin: 'ADMINISTRADOR', 'User system': 'USUARIO' };
    let navigate = useNavigate();
    const dispatch = useDispatch();
    let userSyst = [];
    let { userSystem } = useSelector((state) => state.userSystem);
    userSyst = userSystem.filter((user) => user.role !== ROL_USER);

    const userFormik = useFormik({
        initialValues: {
            idUser: '',
            userType: '',
            fullName: '',
            documentType: ' ',
            documentNumber: '',
            email: '',
            indicative: '132',
            phone: '',
            avatar: '',
        },
        validationSchema: Yup.object({
            userType: Yup.string().required('Este campo es requerido'),
            fullName: Yup.string()
                .max(40, 'El nombre no debe contener mas de 14 carácteres')
                .matches(/[A-Za-z ]+/, 'No se amdmiten numeros')
                .required('Este campo es requerido'),
            // documentType: Yup.string().required("Este campo es requerido"),
            // documentNumber: Yup.string()
            //     .required("Este campo es requerido")
            //     .matches(/^[0-9]+$/gi, 'Solo se admiten números positivos')
            //     .max(10, "El número de documento no debe contener mas de 10 dígitos"),
            phone: Yup.string()
                .required('Este campo es requerido')
                .matches(/^[0-9]+$/gi, 'Solo se admiten números positivos'),
            indicative: Yup.string().required('Este campo es requerido'),
            email: Yup.string()
                .max(30, 'El email no debe contener mas de 14 carácteres')
                .matches(MAILFORMAT, 'Dirección de email invalida')
                .nullable(true)
                .required('Este campo es requerido')
                .test(
                    'Unique Email',
                    'Este correo esta en uso', // <- key, message
                    async function (value) {
                        return new Promise((resolve, reject) => {
                            validateEmail(value, idEdit ? idEdit : null)
                                .then((resp) => {
                                    console.log('Validando email ', value);
                                    if (resp) {
                                        resolve(true);
                                    }
                                    resolve(false);
                                })
                                .catch((e) => resolve(true));
                        });
                    }
                ),
        }),
        onSubmit: (values) => {
            if (!idEdit) {
                try {
                    setSpinner(true);
                    // let values = userFormik.values;
                    let data = {
                        user: {
                            fullName: values.fullName,
                            email: values.email,
                            phone: values.phone,
                            role: values.userType,
                            indicative: values.indicative,
                            documentType: values.documentType,
                            documentNumber: values.documentNumber,
                        },
                    };
                    if (
                        userFormik.isValid &&
                        userFormik.values.email !== '' &&
                        userFormik.values.email !== undefined
                    ) {
                        // console.log('Mostrando usuarios ', data);
                        dispatch(
                            createUserSystemThunk({ data }, (error) => {
                                if (error !== null && !error) {
                                    Message('success', 'Usuario', 'Usuario registrado con éxito');
                                    setSpinner(false);
                                    toggleModalUser();
                                } else if (error.message === ERRORNETWORK) {
                                    Message('error', 'Usuario', SYSTEM_NOT_AVALIBLE);
                                    setSpinner(false);
                                    toggleModalUser();
                                } else {
                                    Message('error', 'Usuario', ERROR_OPERATION);
                                    setSpinner(false);
                                    toggleModalUser();
                                }
                            })
                        );
                        // Message('success', 'Retiro', 'Tu solicitud se encuentra en proceso.')
                        userFormik.resetForm();
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    setSpinner(true);
                    // let values = userFormik.values;
                    let data = {
                        user: {
                            fullName: values.fullName,
                            email: values.email,
                            phone: values.phone,
                            role: values.userType,
                            indicative: values.indicative,
                            documentType: values.documentType,
                            documentNumber: values.documentNumber,
                        },
                    };
                    if (
                        userFormik.isValid &&
                        userFormik.values.email !== '' &&
                        userFormik.values.email !== undefined
                    ) {
                        // console.log('Mostrando usuarios ', data);
                        dispatch(
                            updateUserSystemThunk(idEdit, { data }, (error) => {
                                if (error !== null && !error) {
                                    Message('success', 'Usuario', 'Usuario actualizado con éxito');
                                    setSpinner(false);
                                    toggleModalUser();
                                } else if (error.message === ERRORNETWORK) {
                                    Message('error', 'Usuario', SYSTEM_NOT_AVALIBLE);
                                    setSpinner(false);
                                    toggleModalUser();
                                } else {
                                    Message('error', 'Usuario', ERROR_OPERATION);
                                    setSpinner(false);
                                    toggleModalUser();
                                }
                            })
                        );
                        // Message('success', 'Retiro', 'Tu solicitud se encuentra en proceso.')
                        userFormik.resetForm();
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        },
    });

    const newPasswordFormik = useFormik({
        initialValues: {
            password: "",
            passwordR: "",
        },
        validationSchema: Yup.object({
            password: Yup.string().required("La contraseña es requeria"),
            passwordR: Yup.string().oneOf(
                [Yup.ref("password"), null],
                "Las contraseñas son invalidas"
            ),
        }),
        onSubmit: (values) => {
            console.log("values ----> ", values);
            if (values.passwordR == '') {
                newPasswordFormik.handleBlur.passwordR = true
                newPasswordFormik.setFieldError('passwordR', 'Las contraseñas son invalidas')
            }
            else {
                try {
                    setSpinner(true);
                    // let values = userFormik.values;
                    let data = {
                        user: {
                            password: values.password,
                            id: idEdit
                        },
                    };
                    // console.log('Mostrando usuarios ', data);
                    dispatch(
                        changePasswordUserSystemThunk({ data }, (error) => {
                            if (error !== null && !error) {
                                Message('success', 'Contraseña', 'Contraseña actualizada con éxito');
                                setSpinner(false);
                                newPasswordFormik.resetForm()
                                setIdEdit('')
                                toggleModalPassword();
                            } else if (error.message === ERRORNETWORK) {
                                Message('error', 'Contraseña', SYSTEM_NOT_AVALIBLE);
                                setSpinner(false);
                                newPasswordFormik.resetForm()
                                toggleModalPassword();
                            } else {
                                Message('error', 'Contraseña', ERROR_OPERATION);
                                setSpinner(false);
                                newPasswordFormik.resetForm()
                                toggleModalPassword();
                            }
                        })
                    );
                    // Message('success', 'Retiro', 'Tu solicitud se encuentra en proceso.')
                } catch (e) {
                    console.log(e);
                }
            }
        },
    });

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
        {
            title: 'Tipo Usuario',
            field: 'role',
            lookup: lookup,
            cellStyle: {
                textAlign: 'center',
                fontSize: 13,
            },
            headerStyle: {
                textAlign: 'center',
            },
        },
    ];

    let actions = [
        {
            icon: Edit,
            onClick: (event, rowData) => {
                userFormik.resetForm();
                userFormik.setValues({ ...rowData });
                handleUserType(rowData.role);
                userFormik.setFieldValue('userType', rowData.role == 'User system' ? 3 : 1);
                setIdEdit(rowData.id);
                toggleModalUser(true);
            },
            tooltip: 'Editar',
        },
        {
            icon: KeyOutlined,
            onClick: (event, rowData) => {
                setIdEdit(rowData.id)
                toggleModalPassword()
            },
            tooltip: 'Cambiar/Asignar Password',
        },
    ];

    const OpenModalUserDataInfo = (row) => {
        setUserData(row);
        setModalInfoUser(true);
    };

    const handleIndicative = (value) => {
        userFormik.setFieldValue('indicative', indexData(optionsCountries, 'value')[value]?.value);
    };

    const handleDocumentType = (value) => {
        userFormik.setFieldValue('documentType', value);
    };
    const handleUserType = (value) => {
        userFormik.setFieldValue('userType', indexData(typeUserOption, 'value')[value]?.value);
    };

    const onBlurdescription = (e) => {
        console.log('onBlurdescription', selectedOptions);
        if (selectedOptions?.length > 0) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
        // formikAccountVerify.touched.accountVerifyOptions = true
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

    const downloadImageDocument = (type, img) => {
        if (type == 'front') {
            saveAs(`${BASE_URL_DEV}/user/photo/${img}`, `${userData.documentImagenFront}`);
        } else if (type == 'post') {
            saveAs(`${BASE_URL_DEV}/user/photo/${img}`, `${userData.documentImagenPost}`);
        }
    };

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
            marginTop: -4,
        }),
    };

    const themeSelect = (theme) => ({
        ...theme,
        borderRadius: 5,
        colors: {
            ...theme.colors,
            primary25: '#b2b6d4',
            primary: 'black',
        },
    });

    const showPassword = (type) => {
        switch (type) {
            case 'showP1':
                return setShowPassword1(!showPassword1)
                break;
            case 'showP2':
                return setShowPassword2(!showPassword2)
                break;
            default:
                break;
        }
    }
    return (
        <Grid className=" container">
            <Grid item sm={12} md={4} xs={12} className="mt-4">
                <ButtonAction
                    classNameButon={'button-maim'}
                    handle={toggleModalUser}
                    title={'Usuario'}
                    size={'sm'}
                    fontIcon={<FontAwesomeIcon style={{ marginRight: '2px' }} icon={faUser} />}
                />
            </Grid>
            <Grid className="mb-2">
                <DataTable
                    title="Usuarios"
                    columns={columns}
                    newData={userSyst.length > 0 ? JSON.parse(JSON.stringify(userSyst)) : []}
                    size={4}
                    actions={actions}
                    mtToolbar={null}
                />
            </Grid>
            {/* Componente Loading */}
            {/* {isLoading && <Loading />} */}
            {/* Modal para gestion datos usuario-cliente */}
            <ModalUtils
                title={`${idEdit ? 'Actualizar Usuario' : 'Crear Usuario'}`}
                w100Modal={'w100Modal'}
                size={''}
                open={modalUser}
                toggle={toggleModalUser}
                handleChange={userFormik.handleSubmit}
                spinner={spinner}
                disabled={false}
                visivilityModalFooter={true}
            >
                <Grid container md={12} sm={12} xs={12} spacing={1}>
                    <Grid item md={6} sm={6} xs={12}>
                        <Form className="form-group">
                            <FormGroup>
                                <Label for="fullName">Nombre completo</Label>
                                <Input
                                    type="text"
                                    name="fullName"
                                    placeholder="Ingrese su nombre completo"
                                    onChange={userFormik.handleChange}
                                    onBlur={userFormik.handleBlur}
                                    value={userFormik.values.fullName}
                                    className="inputGlobal"
                                />
                                {userFormik.touched.fullName && userFormik.errors.fullName && (
                                    <div className="bg-red-500 border-l-4">
                                        <p style={{ color: 'black' }}>
                                            {userFormik.touched.fullName && userFormik.errors.fullName}
                                        </p>
                                    </div>
                                )}
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="accountVerify"> Tipo Documento</Label>
                                <SelectComponent
                                    optionsValues={optionsDocumentType}
                                    handle={handleDocumentType}
                                    onBlurFn={(e) => {
                                        console.log('userFormik.handleBlur');
                                        return userFormik.handleBlur;
                                    }}
                                    placeHolder="Tipo documento"
                                    valueOp={userFormik.values.documentType}
                                    name={'documentType'}
                                    styles={stylesSelect}
                                    theme={themeSelect}
                                    calssNameSelect={' input'}
                                />
                                {userFormik.touched.documentType && userFormik.errors.documentType && (
                                    <div className="error-form">
                                        <p>{userFormik.touched.documentType && userFormik.errors.documentType}</p>
                                    </div>
                                )}
                            </FormGroup>
                        </Form>
                    </Grid>
                </Grid>
                <Grid container md={12} sm={12} xs={12} spacing={1}>
                    <Grid item md={6} sm={6} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="accountVerify"> Número documento</Label>
                                <Input
                                    placeholder="Ingrese el número de documento"
                                    type="text"
                                    name="documentNumber"
                                    value={userFormik.values.documentNumber}
                                    onChange={userFormik.handleChange}
                                    onBlur={userFormik.handleBlur}
                                    className="inputGlobal"
                                />
                                {userFormik.touched.documentNumber && userFormik.errors.documentNumber && (
                                    <div className="error-form">
                                        <p>{userFormik.touched.documentNumber && userFormik.errors.documentNumber}</p>
                                    </div>
                                )}
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <Form className="form-group">
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
                                    className="inputGlobal"
                                />
                                {userFormik.touched.email && userFormik.errors.email && (
                                    <div className="bg-red-500 border-l-4">
                                        <p style={{ color: 'black', padding: 1 }}>
                                            {userFormik.touched.email && userFormik.errors.email}
                                        </p>
                                    </div>
                                )}
                            </FormGroup>
                        </Form>
                    </Grid>
                </Grid>
                <Grid container md={12} sm={12} xs={12} spacing={1}>
                    <Grid item md={4} sm={4} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="accountVerify">Indicativo</Label>
                                <SelectComponent
                                    optionsValues={optionsCountries}
                                    handle={handleIndicative}
                                    onBlurFn={userFormik.handleBlur}
                                    placeHolder="Ejemp México(+52)"
                                    valueOp={userFormik.values.indicative}
                                    name={'indicative'}
                                    styles={stylesSelect}
                                    theme={themeSelect}
                                    calssNameSelect={'z-index-select-user-type  input'}
                                />
                                {userFormik.touched.indicative && userFormik.errors.indicative && (
                                    <div className="error-form">
                                        <p>{userFormik.touched.indicative && userFormik.errors.indicative}</p>
                                    </div>
                                )}
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                        <Form>
                            <FormGroup className="mb-0">
                                <Label for="telefono">Teléfono</Label>
                                <NumberFormat
                                    customInput={Input}
                                    isNumericString={true}
                                    id="telefono"
                                    placeholder="+52 954 741 0505"
                                    onChange={(e) => userFormik.setFieldValue('phone', e.target.value)}
                                    onBlur={userFormik.handleBlur}
                                    value={userFormik.values.phone}
                                    className="inputGlobal"
                                />
                                <div className="bg-red-100 border-l-4">
                                    <p style={{ color: 'black', padding: 3 }} className="mb-0">
                                        {userFormik.touched.phone && userFormik.errors.phone}
                                    </p>
                                </div>
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                        <Form>
                            <FormGroup>
                                <Label for="userType"> Seleccione el Tipo de usuario</Label>
                                <SelectComponent
                                    optionsValues={typeUserOption}
                                    handle={handleUserType}
                                    onBlurFn={userFormik.handleBlur}
                                    valueOp={userFormik.values.userType}
                                    name={'userType'}
                                    placeHolder="Tipo usuario"
                                    styles={stylesSelect}
                                    theme={themeSelect}
                                    calssNameSelect={'z-index-select-user-type input'}
                                />
                                {userFormik.touched.userType && userFormik.errors.userType && (
                                    <div className="">
                                        <p>{userFormik.touched.userType && userFormik.errors.userType}</p>
                                    </div>
                                )}
                            </FormGroup>
                        </Form>
                    </Grid>
                </Grid>
            </ModalUtils>
            {/* Modal gestion de contraseñas */}
            <ModalUtils
                title={`Gestionar Contraseñas`}
                w100Modal={'w40Modal'}
                size={''}
                open={modalPassword}
                toggle={toggleModalPassword}
                handleChange={newPasswordFormik.handleSubmit}
                spinner={spinner}
                disabled={false}
                visivilityModalFooter={true}
            >
                {/* <Grid item marginBottom={2} md={12} sm={12} xs={12} display={'flex'} alignContent={'center'} alignItems={'center'}>
                    <Input
                        type="checkbox"
                        style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                        value={chkPassword}
                        onChange={(e) => setChkPasswor(e.target.checked)}
                    />
                    <Typography display={'flex'} style={{ display: 'flex', marginLeft: '12px' }}>
                        Cambiar Contraseña
                    </Typography>
                </Grid> */}
                <Grid container spacing={1} md={12} sm={6} xs={12} display={'flex'} alignContent={'center'} alignItems={'center'}>
                    <Grid item md={11} sm={11} xs={12} >
                        <Form className="form-group">
                            <FormGroup>
                                <Label for="fullName">Ingrese la contraseña</Label>
                                <Input
                                    type={`${showPassword1 ? 'text' : 'password'}`}
                                    name="password"
                                    placeholder="Ingrese la contraseña"
                                    onChange={newPasswordFormik.handleChange}
                                    onBlur={newPasswordFormik.handleBlur}
                                    value={newPasswordFormik.values.password}
                                    className="inputGlobal"
                                />
                                {newPasswordFormik.touched.password && newPasswordFormik.errors.password && (
                                    <div className="bg-red-500 border-l-4">
                                        <p style={{ color: 'black' }}>
                                            {newPasswordFormik.touched.password && newPasswordFormik.errors.password}
                                        </p>
                                    </div>
                                )}
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid onClick={() => showPassword('showP1')} item md={1} sm={1} xs={12} style={{ cursor: 'pointer' }} title='Ver contraseña'>
                        <span><FontAwesomeIcon icon={showPassword1 ? faEye : faEyeSlash} /></span>
                    </Grid>
                </Grid>
                <Grid container spacing={1} md={12} sm={6} xs={12} display={'flex'} alignContent={'center'} alignItems={'center'}>
                    <Grid item md={11} sm={11} xs={12} >
                        <Form className="form-group">
                            <FormGroup>
                                <Label for="fullName">Repita la contraseña</Label>
                                <Input
                                    type={`${showPassword2 ? 'text' : 'password'}`}
                                    name="passwordR"
                                    placeholder="Repita la contraseña"
                                    onChange={newPasswordFormik.handleChange}
                                    onBlur={newPasswordFormik.handleBlur}
                                    value={newPasswordFormik.values.passwordR}
                                    className="inputGlobal"
                                />
                                {newPasswordFormik.touched.passwordR && newPasswordFormik.errors.passwordR && (
                                    <div className="bg-red-500 border-l-4">
                                        <p style={{ color: 'black' }}>
                                            {newPasswordFormik.touched.passwordR && newPasswordFormik.errors.passwordR}
                                        </p>
                                    </div>
                                )}
                            </FormGroup>
                        </Form>
                    </Grid>
                    <Grid onClick={() => showPassword('showP2')} title='Ver contraseña' item md={1} sm={1} xs={12} style={{ cursor: 'pointer' }}>
                        <span><FontAwesomeIcon icon={showPassword2 ? faEye : faEyeSlash} /></span>
                    </Grid>
                </Grid>
            </ModalUtils>
        </Grid>
    );
};

export default UserSystem;
