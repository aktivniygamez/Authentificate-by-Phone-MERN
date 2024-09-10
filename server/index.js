import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import Verification from './models/VerificationModel.js'
import cors from 'cors';
import { config } from 'dotenv';

config({ path: './config.env' })

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/validation")
  .then(() => {
    console.log('DB is running')
  })
  .catch((err) => {
    console.log(err)
  });
//

app.post('/send_code', async (req, res) => {
  const phoneNumber = req.body.phone;
  const ip = process.env.IP;
  const apiId = process.env.API_ID;

  try {
    const response = await axios.get(`https://sms.ru/code/call?phone=${phoneNumber}&ip=${ip}&api_id=${apiId}`)

    if (response.data.code) {
      const code = response.data.code

      const existingVerification = await Verification.findOne({ phone: phoneNumber });

      if (existingVerification) {
        await Verification.findOneAndUpdate({ phone: phoneNumber }, { verificationCode: code })
        res.status(200).send({ success: true })
      } else {
        const doc = new Verification({
          phone: phoneNumber,
          verificationCode: code
        })
        await doc.save()
      }
      res.status(200).send({ success: true })
    } else {
      res.status(500).send({ success: false })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send('Ошибка сервера')
  }
})

app.post('/verify_code', async (req, res) => {
  const phoneNumber = req.body.phone
  const verifyCode = req.body.code

  try {
    const data = await Verification.findOne({ phone: phoneNumber })

    if (!data) {
      res.status(400).send({ success: false });
    } else {
      if (data.verificationCode === verifyCode) {
        res.send({ success: true });
        await Verification.findOneAndDelete({ phone: phoneNumber })
      } else {
        res.status(401).send({ success: false });
      }
    }

  } catch (error) {
    console.log(error)
    res.status(500).send('Ошибка сервера')
  }
})

app.listen(5000, () => console.log('Server is running'))