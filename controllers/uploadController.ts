import express from 'express'
import sharp from 'sharp'

export const upload = (req: express.Request, res: express.Response) => {
  if (req.file) {
    const filePath = req.file.path

    const fileType = req.file.mimetype.split('/').pop()

    if (fileType !== 'jpeg') {
      sharp(filePath)
        .resize(150, 150)
        .toFormat('jpeg')
        .toFile(filePath.replace('.png', '.jpeg'), (err) => {
          if (err) {
            throw err
          }
          // res.json(req.file)
          res.json({
            url: `/avatars/${req.file?.filename.replace('.png', '.jpeg')}`,
          })
        })
    } else {
      sharp(filePath)
        .resize(150, 150)
        .toBuffer((err) => {
          if (err) {
            throw err
          }
          // res.json(req.file)
          res.json({
            url: `../backend/avatars/${req.file?.filename.replace('.png', '.jpeg')}`,
          })
        })
    }
  }
}
