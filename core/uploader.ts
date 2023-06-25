import multer from 'multer'

export const uploader = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './avatars')
    },
    filename(req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.floor(Math.random() * 10000) /* nanoid(6) */
      // Отримую розширення файла
      const fileExtension = file.mimetype.split('/').pop()
      callback(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension)
    },
  }),
})
