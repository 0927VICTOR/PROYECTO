import { gambatteApi } from "app/api/gambatteApi";

export const uploadFileService = (id, files) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { data: { data, status } } = await gambatteApi.put(`user/upload-file/${id}`, files, { headers: { 'Content-Type': 'multipart/form-data' } })
            if (status === 'ok') {
                resolve(data)
            }
        } catch (error) {
            console.log('Mostrando el error : ', error);
            reject(error)
        }
    })
}

export const getFileService = async (file) => {
    let resp = null
    try {
        let { data } = await gambatteApi.get(`/user/photo/${file}`)
        resp = data
    } catch (error) {
        resp = error
    }
    return resp
}