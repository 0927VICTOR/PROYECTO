import React, { useEffect, useState } from 'react'
import { Card, CardActions, CardContent, CardMedia, Grid, Typography, styled } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash'
import NumberFormat from "react-number-format";

//Slices
import { getUserById, updateUser, updateUserFile, updateUserFileDocuments } from 'app/slices/userSlice/users';


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
    IMG_AVATAR,
    MAILFORMAT,
    NO_IMAGE,
    SYSTEM_NOT_AVALIBLE
} from '../../../utils/constant'
import useAuth from 'app/hooks/useAuth';
import { getFileService, uploadFileService } from 'app/services/uploadServices';
import { indexData, validateEmail } from 'app/utils/utils';
import { getCountries } from 'app/services/utils.services';
import SelectComponent from 'app/components/select/SelectComponent';
import WebcamCapture from 'app/components/CaptureImage/WebcamCapture';

const PerfilUser = () => {

    const [spinner, setSpinner] = useState(false);
    const [modal, setModal] = useState(false)
    const [modalAvatar, setModalAvatar] = useState(false)
    const [modalDocs, setModalDocs] = useState(false)
    const [loading, setLoading] = useState(false)
    const [messageNamImage, setMessageNamImage] = useState('')
    const [fileAvatar, setFileFileAvatar] = useState(null);
    const [fileNameAvatar, setFileNameAvatar] = useState('');
    const [countDocuments, setCountDocuments] = useState(0);
    const [fileFrontDocument, setFileFrontDocument] = useState(null);
    const [filePosteriorDocument, setFileFilePosteriorDocument] = useState(null);
    const [nameDocumentUser, setNameDocumentUser] = useState({ nameDocumentFront: '', nameDocumentPost: '' });
    const [imgTempFront, setImgTempFront] = useState(null);
    const [imgTempPost, setImgTempPost] = useState(null);
    const [fileName, SetFileName] = useState("Ningún archivo selecionado");
    const [renderTooltip, setRenderTooltip] = useState(true);
    const [imgTemp, setImgTemp] = useState(null);
    const [valueCountry, setValueCountry] = useState(null);
    const [optionsCountries, setOptionsCountries] = useState([]);

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

    const dispatch = useDispatch();
    let { users } = useSelector((state) => state.users);
    const { user } = useAuth()

    users = _.find(users, { id: user.id })

    const userFormik = useFormik({
        initialValues: {
            idUser: '',
            fullName: '',
            documentType: '',
            documentNumber: '',
            email: '',
            indicative: '',
            phone: '',
            postalCode: '',
            avatar: '',
            documentImagenFront: '',
            documentImagenPost: '',
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
                            validateEmail(value, user.id)
                                .then(resp => {
                                    if (resp) {
                                        resolve(true)
                                    }
                                    resolve(false)
                                }).catch((e => resolve(true)))
                        });
                    }
                ),
            // indicative: Yup.string()
            //     .required('Este campo es requerido'),
            phone: Yup.number()
                .required('Este campo es requerido')
                .positive('El número de phone debe de contener numeros mayores a 0'),
        }),
        onSubmit: (values) => {
            console.log('Mostrando datos ', values);
            try {
                setSpinner(true)
                // let values = userFormik.values;
                let data = {
                    user: {
                        ...values
                    },
                }
                if (userFormik.isValid && userFormik.values.email !== '' && userFormik.values.email !== undefined) {
                    dispatch(updateUser(user.id, data, (error) => {
                        if (error !== null && !error) {
                            Message('success', 'Perfil', DATA_UPDATE)
                            setSpinner(false)
                        }
                        else if (error.message === ERRORNETWORK) {
                            Message('error', 'Perfil', SYSTEM_NOT_AVALIBLE)
                            setSpinner(false)
                        }
                        else {
                            Message('error', 'Perfil', ERROR_OPERATION)
                            setSpinner(false)
                        }
                    }))
                    // Message('success', 'Retiro', 'Tu solicitud se encuentra en proceso.')
                    // userFormik.resetForm()
                    // setModal(false)
                }
            } catch (e) {
                console.log(e);
            }
        }
    })

    useEffect(() => {
        if (typeof users !== 'undefined' && users !== null) {
            userFormik.setErrors({
                email: false
            })
            initChargerData()
            showTooltip('* Subir las fotos en su mayor calidad', 5000)
        }
    }, [users]);

    const renderHTML = (country, code) => {
        return (
            <Grid
                display={'flex'}
                alignContent={'center'}
                alignItems={'center'}
                justifyContent={'space-between'}
            >
                <Typography style={{ fontSize: '10px' }} variant='h9' >{country} </Typography>
                <Typography style={{ fontSize: '11px' }} variant='h6'> + {code}</Typography>
            </Grid>
        )
    }

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

    function initChargerData() {
        userFormik.setFieldValue('idUser', users?.idUser)
        userFormik.setFieldValue('idUser', users?.idUser)
        userFormik.setFieldValue('documentType', users?.documentType)
        userFormik.setFieldValue('documentNumber', users?.documentNumber)
        userFormik.values.fullName = users?.fullName && users?.fullName
        // userFormik.setFieldValue('fullName', users?.fullName)
        userFormik.values.email = users?.email && users?.email

        userFormik.setFieldValue('indicative', users?.indicative)
        userFormik.setFieldValue('postalCode', users?.postalCode)
        userFormik.values.phone = users?.phone && users?.phone
        // userFormik.setFieldValue('phone', users?.phone)
        userFormik.setFieldValue('avatar', users?.avatar)
        userFormik.setFieldValue('documentImagenFront', users?.documentImagenFront)
        userFormik.setFieldValue('documentImagenPost', users?.documentImagenPost)
        setTimeout(() => {

        }, 1000);
    }

    const onChangeDocumentType = (value) => {
        let docType = _.find(documentType, (docType => docType.id == value))
        userFormik.setFieldValue('documentType', docType.documentType)
    }

    const toggleModalAvatar = () => {
        setModalAvatar(!modalAvatar)
        //limpiarCampos()
    };
    //setImgTemp(`${gambatteApi.get('/user/photo')}/${users[0]?.avatar}`)
    const toggleModalDocs = () => {
        setRenderTooltip(true)
        showTooltip('* Subir las fotos en su mayor calidad', 4000)
        setModalDocs(!modalDocs)
        //limpiarCampos()
    };

    const selectedHandlerFile = (e) => {
        const file = e.target.files[0];
        if (!file) { return; }
        setFileFileAvatar(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgTemp(reader.result)
        }
        let name = e.target.files[0].name;
        SetFileName(name);
        setFileNameAvatar(name);
        // console.log('Mostrando archivo selectedHandler => ', file, name, e.target.files[0])
    };

    const sendHandlerAvatar = async () => {
        if (fileAvatar) {
            const formData = new FormData();
            formData.append("image", fileAvatar)
            try {
                let fileUpdate = await uploadFileService(user.id, formData)
                console.log(fileNameAvatar, fileUpdate);
                // setFileNameAvatar(fileUpdate)
                dispatch(updateUserFile(user.id, fileUpdate[fileNameAvatar.split('.')[0]], (error) => {
                    if (error !== null && !error) {
                        Message('success', 'Avatat', 'Avatar actualizado correctamente.')
                        setMessageNamImage(false)
                        setFileNameAvatar(null)
                        // setModalAvatar(false)
                    }
                    else if (error.message === ERRORNETWORK) {
                        Message('error', 'Avatar', 'Lo sentimos el sistema no esta diponible en estos momentos.')
                        setMessageNamImage(false)
                        setFileNameAvatar(null)
                        setSpinner(false)
                        renderTooltip(false)
                    }
                    else {
                        Message('error', 'Avatar', 'No sa ha podido relizar esta operación.')
                        setImgTemp(null)
                        setMessageNamImage(false)
                        //setSpinner(false)
                    }
                }))
            } catch (error) {
                console.log('Error file upload ', error);
            }

            // Falta programar el update de la imagen
            // console.log(Object.fromEntries(formData))

        }

    }

    const closeModalAvatar = async () => {
        setImgTemp(null)
        setModalAvatar(false)
        setMessageNamImage(true)
    }

    const selectedHandlerFileDocumentFront = (e) => {
        setImgTempFront(null)
        const file = e.target.files[0];
        if (!file) { return; }
        setFileFrontDocument(file);
        const reader1 = new FileReader();
        reader1.readAsDataURL(file);
        reader1.onloadend = () => {
            setImgTempFront(reader1.result)
        }
        let name = e.target.files[0].name.split('.')[0];
        setNameDocumentUser({ ...nameDocumentUser, nameDocumentFront: name })
        // SetFileName(name);
        // console.log('Mostrando archivo selectedHandler => ', file, name, e.target.files[0])
    };

    const selectedHandlerFileDocumentPost = (e) => {
        const file = e.target.files[0];
        if (!file) { return; }
        setFileFilePosteriorDocument(file);
        const reader2 = new FileReader();
        reader2.readAsDataURL(file);
        reader2.onloadend = () => {
            setImgTempPost(reader2.result)
        }
        let name = e.target.files[0].name.split('.')[0];
        setNameDocumentUser({ ...nameDocumentUser, nameDocumentPost: name })
        // SetFileName(name);
    };

    const uploadsDocuments = async () => {
        if (!imgTempFront || !imgTempPost) {
            setRenderTooltip(true)
            showTooltip('* Por favor seleccione las fotos del documento!', 4000)
        }
        const formData = new FormData();
        formData.append("documentImagenFront", fileFrontDocument)
        formData.append("documentImagenPost", filePosteriorDocument)
        console.log('Mostrando nombre de las imagenes :',
            nameDocumentUser.nameDocumentFront, nameDocumentUser.nameDocumentPost);
        console.log(Object.fromEntries(formData))
        try {
            let data = await uploadFileService(user.id, formData)
            dispatch(updateUserFileDocuments(
                user.id,
                {
                    documentImagenFront: data[nameDocumentUser.nameDocumentFront],
                    documentImagenPost: data[nameDocumentUser.nameDocumentPost],
                }, (error) => {
                    if (error !== null && !error) {
                        Message('success', 'Documentos', 'Documentos actualizados correctamente.')
                        setMessageNamImage(false)
                        setFileFrontDocument(null)
                        setFileFilePosteriorDocument(null)
                        // setModalAvatar(false)}
                    }
                    else if (error.message === ERRORNETWORK) {
                        Message('error', 'Avatar', 'Lo sentimos el sistema no esta diponible en estos momentos.')
                        setMessageNamImage(false)
                        setFileNameAvatar(null)
                        setSpinner(false)
                        renderTooltip(false)
                    }
                    else {
                        Message('error', 'Avatar', 'No sa ha podido relizar esta operación.')
                        setImgTemp(null)
                        setMessageNamImage(false)
                        //setSpinner(false)
                    }
                }))
        } catch (error) {
            console.log('Error file upload ', error);
        }
    }

    const showTooltip = (message, time) => {
        setMessageNamImage(message)
        setTimeout(() => {
            setRenderTooltip(false)
        }, time)
    }

    const handeloChangeCoutryIndicative = value => {
        setValueCountry(value)
        userFormik.setFieldValue('indicative', indexData(optionsCountries, 'value')[value]?.value)
        // console.log('llego a handeloChangeCoutryIndicative', userFormik.errors.indicative);
    }

    const handeloChangeDocumentType = (value) => {
        userFormik.setFieldValue('documentType', value)
    }

    const onBlurIndacative = (e) => {
        userFormik.touched.indicative = true
    }

    const onBlurDocumentType = (e) => {
        userFormik.touched.documentType = true
    }

    const stylesSelect = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? 'solid #ced4da' : 'solid #ced4da',
            border: !state.isFocused ? 'solid #ced4da' : 'solid #ced4da',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            height: 32,
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
            minHeight: '90px'
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
        <Grid className=' container'>
            <Grid container spacing={2}>
                {
                    // users && Object.entries(users).length !== 0 && (
                    typeof users !== 'undefined' && users !== null && (
                        <Grid item md={3} sm={12} xs={12}>
                            <Card sx={{ maxWidth: '100%', textAlign: 'center', justifyContent: 'center' }} className='mt-3'>
                                <Typography textAlign={'center'} marginTop={3} gutterBottom variant="h5" component="div">
                                    Avatar
                                </Typography>
                                <Grid
                                    display={'flex'}
                                    sx={{
                                        margin: '0 auto'
                                    }}
                                    alignContent={'center'}
                                    justifyContent={'center'}>
                                    <CardMedia
                                        component="img"
                                        alt="green iguana"
                                        height="125"
                                        className='card-user-perfil'
                                        image={!userFormik?.values?.avatar && IMG_AVATAR}
                                        src={userFormik?.values?.avatar && `${BASE_URL_PROD}/user/photo/${userFormik?.values?.avatar}`}
                                        sx={{ height: '178px' }}
                                    />
                                </Grid>
                                <CardContent>
                                </CardContent>
                                <CardActions style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                    <ButtonAction
                                        title={'Cambiar Avatar'}
                                        classNameButon={'button-maim'}
                                        size={'sm'}
                                        handle={toggleModalAvatar}
                                    />
                                </CardActions>
                            </Card>
                        </Grid>

                    )
                }
                {
                    typeof users !== 'undefined' && users !== null && (
                        <Grid item md={9} sm={12} xs={12}>
                            <Typography textAlign={'center'} marginTop={1} gutterBottom variant="h5" component="div">
                                Información personal
                            </Typography>
                            <Grid item md={4} sm={2} xs={12} >
                                <Form >
                                    <FormGroup>
                                        <Label for="idUser">ID</Label>
                                        <Input
                                            type="text"
                                            name="idUser"
                                            onChange={userFormik.handleChange}
                                            onBlur={userFormik.handleBlur}
                                            value={userFormik?.values?.idUser}
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
                                            <Label for="postalCode">Còdigo postal</Label>
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
                                            <Label for="bank">Tipo documento</Label>
                                            <SelectComponent
                                                optionsValues={optionsDocumentType}
                                                valueOp={userFormik.values.documentType}
                                                handle={handeloChangeDocumentType}
                                                onBlurFn={onBlurDocumentType}
                                                placeHolder='Tipo documento'
                                                name='documentType'
                                                styles={stylesSelect}
                                                theme={themeSelect}
                                                calssNameSelect={'z-index-select'}
                                            />
                                            <div className="bg-red-100 border-l-4">
                                                <p style={{ color: 'black' }} className="mb-0">
                                                    {userFormik.touched.bank && userFormik.errors.ebank}
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
                                                        optionsValues={optionsCountries && optionsCountries}
                                                        valueOp={userFormik.values.indicative}
                                                        handle={handeloChangeCoutryIndicative}
                                                        t={'handeloChangeCoutryIndicative'}
                                                        onBlurFn={onBlurIndacative}
                                                        placeHolder='+ 52'
                                                        name='indicative'
                                                        calssNameSelect={'z-index-select'}
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
                            <Grid item className='mb-1' display={'flex'}>
                                <ButtonAction
                                    title={'Actualizar datos'}
                                    classNameButon={'button-maim'}
                                    size={'sm'}
                                    handle={userFormik.handleSubmit}
                                    fontIcon={spinner && <FontAwesomeIcon icon={faRotate} spin />}
                                />
                                <ButtonAction
                                    title={'subir documentos'}
                                    classNameButon={'button-maim'}
                                    size={'sm'}
                                    handle={toggleModalDocs}
                                />
                            </Grid>
                        </Grid>
                    )
                }

            </Grid>
            {/* Modal Avatar */}
            <ModalUtils
                open={modalAvatar}
                title={'Cambia tu avatar'}
                toggle={closeModalAvatar}
                handleChange={closeModalAvatar}
                size={'40%'}
                visivilityModalFooter={true}
            >
                <Grid container >
                    <Grid container >
                        <Grid item md={12} sm={12} xs={12} >
                            <Grid className='btns-update-file'>
                                <Grid>
                                    {/* <input onChange={selectedHandler} type="file" name="choose_file" id="choose_file" class="inputfile custom" /> */}
                                    <input
                                        type="file"
                                        id="choose_file"
                                        className="inputfile"
                                        onChange={selectedHandlerFile}
                                    />
                                    <label for="choose_file">
                                        {" "}
                                        Selecciona un avatar
                                    </label>
                                    <span>
                                        {/*<strong> {fineName} </strong>*/}
                                    </span>

                                </Grid>
                                <Grid item >
                                    <ButtonAction
                                        title='Subir'
                                        size={'sm'}
                                        classNameButon={'button-maim'}
                                        handle={sendHandlerAvatar}
                                        fontIcon={spinner ? <FontAwesomeIcon icon={faRotate} spin /> : <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ marginRight: '2px' }} />}
                                    />
                                </Grid>
                            </Grid>
                            <label>
                                {" "}
                                <strong>
                                    {" "}
                                    {!messageNamImage ? "Foto subida con éxito !!" : false}{" "}
                                </strong>
                            </label>
                            <Grid className="div-img-producto">
                                <Grid className="div-img-perfil">
                                    {!imgTemp && userFormik.values.avatar ? (<img src={`${BASE_URL_PROD}/user/photo/${userFormik.values.avatar}`}></img>) : imgTemp ? (<img src={`${imgTemp}`}></img>) : (<img src={`${IMG_AVATAR}`}></img>)}
                                    {/* {imgTemp && <img src={`${imgTemp}`}></img>} */}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ModalUtils>
            {/* Modal Subir documentos */}
            <ModalUtils
                open={modalDocs}
                title={`Subir Documentos`}
                toggle={toggleModalDocs}
                handleChange={toggleModalDocs}
                w100Modal={"w100Modal"}
                visivilityModalFooter={true}
            >
                <Grid container  >
                    <Grid md={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        {renderTooltip && <Typography variant='h6' style={{ fontSize: '9px' }}>{messageNamImage}</Typography>}
                    </Grid>
                    <WebcamCapture
                        imgFront={null}
                        imgPost={null}
                        imgTempFront1={imgTempFront}
                        imgTempPost2={imgTempPost}
                        selectedHandlerFileDocumentFront={selectedHandlerFileDocumentFront}
                        selectedHandlerFileDocumentPost={selectedHandlerFileDocumentPost}
                        buttonsVisibility={true}
                    />
                    <Grid md={12} sm={12} xs={12} className='center-button-upload' >
                        <ButtonAction
                            title='Subir'
                            size={'sm'}
                            classNameButon={'button-maim'}
                            handle={uploadsDocuments}
                            fontIcon={spinner ? <FontAwesomeIcon icon={faRotate} spin /> : <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ marginRight: '2px' }} />}
                        />
                    </Grid>
                </Grid>
            </ModalUtils>
        </Grid>
    )
}


export default PerfilUser