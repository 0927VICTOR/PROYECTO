import { Grid } from '@mui/material';
import { BASE_URL_PROD, NO_IMAGE } from 'app/utils/constant';
import React, { useEffect, useState } from 'react';

const WebcamCapture = ({ selectedHandlerFileDocumentFront, selectedHandlerFileDocumentPost, imgFront, imgPost, imgTempFront1, imgTempPost2, buttonsVisibility, hondleDownload }) => {

    const [imgTempFront, setImgTempFront] = useState(null);
    const [imgTempPost, setImgTempPost] = useState(null);
    const [front, setFront] = useState(null);
    const [post, setPost] = useState(null);

    useEffect(() => {
        setImgTempFront(imgTempFront1)
    }, [imgTempFront1])

    useEffect(() => {
        setImgTempPost(imgTempPost2)
    }, [imgTempPost2])

    useEffect(() => {
        setFront(imgFront)
    }, [imgFront])

    useEffect(() => {
        setPost(imgPost)
    }, [imgPost])

    return (
        <>
            <Grid container spacing={2} >
                <Grid item md={6} sm={12} xs={12}>
                    {buttonsVisibility && <Grid className='text-center'>
                        <input
                            type="file"
                            id="choose_file2"
                            className=""
                            onChange={selectedHandlerFileDocumentFront}
                        />
                        <label for="choose_file2">
                            {" "}
                            Foto frontal
                        </label>
                        <span>
                            {/*<strong> {fineName} </strong>*/}
                        </span>
                    </Grid>}
                    <div onClick={() => hondleDownload ? hondleDownload('front', front) : false} title='Descargar Imágen' style={{ cursor: 'pointer' }}>
                        <Grid md={12} className="div-img-frontal">
                            <Grid className="div-img-docs">
                                {!front
                                    ? (<img className='no-image-style' src={imgTempFront ? imgTempFront : NO_IMAGE}></img>)
                                    : (<img style={{ minWidth: '100%', borderRadius: '10px', padding: '0px', maxHeight: '145px' }} src={`${BASE_URL_PROD}/user/photo/${front}`}></img>)
                                }
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    {buttonsVisibility && <Grid className='text-center'>
                        <input
                            type="file"
                            id="choose_file3"
                            className=""
                            onChange={selectedHandlerFileDocumentPost}
                        />
                        <label for="choose_file3">
                            {" "}
                            Foto Posterior
                        </label>
                        <span>
                            {/*<strong> {fineName} </strong>*/}
                        </span>
                    </Grid>}
                    <div onClick={() => hondleDownload ? hondleDownload('post', post) : false} title='Descargar Imágen' style={{ cursor: 'pointer' }}>
                        <Grid md={12} className="div-img-frontal">
                            <Grid className="div-img-docs">
                                {!post
                                    ? (<img className='no-image-style' src={imgTempPost ? imgTempPost : NO_IMAGE}></img>)
                                    : (<img style={{ minWidth: '100%', borderRadius: '10px', padding: '0px', maxHeight: '145px' }} src={`${BASE_URL_PROD}/user/photo/${post}`}></img>)
                                }
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </>
    )
}



export default WebcamCapture