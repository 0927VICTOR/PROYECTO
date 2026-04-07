const { v4: uuidv4 } = require("uuid");
let moment = require("moment");
const fs = require("fs");
const path = require("path");
let responseData = "";
const STATICVAR = require("../helpers/utils").staticVar;
const { response } = require("../helpers/utils");

const validateExtension = async (img, res) => {
  return new Promise(async (resolve, reject) => {
    let ext_file = [
      "png",
      "PNG",
      "jpg",
      "JPG",
      "jpge",
      "jpeg",
      "mpge",
      "mpg",
      "gif",
    ];
    let ext_type = img.name.split(".")[1];

    if (ext_file.indexOf(ext_type) < 0) {
      let msg = STATICVAR.USER_UPDATE_FILE_ERROR.replace("NAME_FILE", img.name);
      msg += msg.replace("EXT_AVALIBLE", ext_file.join(", "));
      return response(msg, 400, res, false, []);
    } else {
      let fecha = moment().format("YYYY-MM-DD").replace("-", "_");
      let fileName = `${uuidv4()}-${fecha}-${img.name}`;
      //console.log("soy la img", img)
      let nameImage = img.name;
      nameImage = nameImage.split(".");
      nameImage = nameImage[0];
      let data = '"' + nameImage + '"' + ":" + '"' + fileName + '"';
      responseData += data;

      let route = `./src/storage/images/${fileName}`;
      img.mv(`${route}`, (error) => {
        if (error) {
          return response(
            'Archivos subidos exitosamente',
            400,
            res,
            false,
            []
          );
        }
        else {
          return resolve(true);
        }
      });
    }
  });
};

const uploapFile = async (req, res) => {
  if (!req.files) {
    return res.status(400).send({
      ok: false,
      err: {
        message: "No se seleccionado ningún archivo",
      },
    });
  }
  let keysFiles = Object.keys(req.files);
  let keysValues = Object.values(req.files);


  if (keysFiles.length > 1) {
    for (const keys in keysValues) {
      validateExtension(keysValues[keys], res);
    }
    responseData = responseData.replaceAll('""', '","');
    let dataNew = "{" + responseData + "}";
    let data = JSON.parse(dataNew);
    responseData = "";
    if (data) {
      return response(
        'Archivo subido exitosamente',
        200,
        res,
        "ok",
        data
      );
    }


  } else {

    // console.log("soy va una imagen ", keysValues[0])
    let responses = await validateExtension(keysValues[0], res);
    responseData = responseData.replaceAll('""', '","');
    //console.log("soy va una responseData", responseData)
    let dataNew = "{" + responseData + "}";
    let data = JSON.parse(dataNew);

    if (data) {
      return response(
        STATICVAR.USER_UPDATE_AVATAR_SUCCESSFULL,
        200,
        res,
        "ok",
        data
      );
    }
  }
};

function getImageFile(req, res) {
  let imageFIle = req.params.imageFile;
  let pathFIle = `./src/storage/images/${imageFIle}`;
  if (fs.existsSync(pathFIle)) {
    res.sendFile(path.resolve(pathFIle));
  } else {
    console.log("Error : ");
    return res.status(404).send({ message: "No se ha encontrado la imagen" });
  }
}

const deleteFile = (file) => {
  // if (file.length > 0) {
  //   for (let i = 0; i < file.length; i++) {
  //     let pathFIle = `./src/storage/images/${file[i]}`;
  //     try {
  //       fs.unlinkSync(pathFIle);
  //       if (i == file.length) {
  //         console.log('Mostrando files', file, file[i]);
  //         return true;
  //       }
  //     } catch (err) {
  //       console.error("Something wrong happened removing the file", err);
  //       return false;
  //     }
  //   }
  // } else {
  let pathFIle = `./src/storage/images/${file}`;
  try {
    fs.unlinkSync(pathFIle);
    return true;
  } catch (err) {
    console.error("Something wrong happened removing the file", err);
    return false;
  }
  // }
}

// console.log(pathFIle);


module.exports = {
  uploapFile,
  getImageFile,
  deleteFile,
};
