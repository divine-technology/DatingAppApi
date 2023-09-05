import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { google } from 'googleapis';
dotenv.config();

const OAuth2 = google.auth.OAuth2;
let privateOAuth2 = null;

@Injectable()
export class MailerService {
  constructor() {}

  async sendMail() {
    const transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.CLIENT_REFRESH_TOKEN
      }
    });

    let info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: 'dzanin.masic1@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      html: '<b>Hello world?</b>' // html body
    });
    console.log('Message sent: %s', info);
  }
}
