
import multer, { diskStorage } from 'multer'


const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/storange/img')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname} -${Date.now()}`)
  }
})

const upload = multer({ storage })
export default upload;