import { join } from 'path';
import moment from 'moment';
import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { UserProps } from '../users/interfaces/user.interfaces';
require('dotenv').config();

const {
  EMAIL_USER,
  EMAIL_HOST,
  EMAIL_PASSWORD,
} = process.env;
export const emailIconsPath = join(
  __dirname,
  '../../../src/modules/mail/attachments',
);


export const emailAttachments = [
  // {
  //   filename: 'CompanyLogo.png',
  //   path: `${emailIconsPath}/CompanyLogo.png`,
  //   cid: 'companyLogo',
  // },
  {
    filename: 'XLogo.png',
    path: `${emailIconsPath}/XLogo.png`,
    cid: 'XLogo',
  },
  {
    filename: 'TiktokLogo.png',
    path: `${emailIconsPath}/TiktokLogo.png`,
    cid: 'TiktokLogo',
  },
  {
    filename: 'InstagramLogo.png',
    path: `${emailIconsPath}/InstagramLogo.png`,
    cid: 'InstagramLogo',
  },
  {
    filename: 'YoutubeLogo.png',
    path: `${emailIconsPath}/YoutubeLogo.png`,
    cid: 'YoutubeLogo',
  },
];

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserVerificationEmail(
    user: UserProps,
    emailToken: string,
  ): Promise<void> {
    const url = `${this.configService.get(
      'SERVER_URL',
    )}/backend/v1/user/verify-account/${emailToken}`;

    const confirmationTemplate = {
      from: process.env.EMAIL_USER,
      subject: 'Verify Your Email Address For VOPA',
      context: {
        url: url,
      },
      attachments: [...emailAttachments],
    };

    const msg = {
      to: user.email,
      ...confirmationTemplate,
    };

    await this.sendEmailVerificationMail(msg);
  }

  async sendEmailVerificationMail(options: ISendMailOptions): Promise<void> {
    try {
      return await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        text: options.text,
        template: 'emailVerification',
        context: options.context,
        attachments: options.attachments,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendForgotPasswordEmail(
    email: string,
    emailToken: string,
  ): Promise<void> {
    const url = `${this.configService.get(
      'SERVER_URL',
    )}/backend/v1/user/reset-password?code=${emailToken}`;

    const confirmationTemplate = {
      from: process.env.EMAIL_USER,
      subject: '[VOPA] Password Reset Request',
      context: {
        email: email,
        url: url,
      },
      attachments: [...emailAttachments],
    };

    const msg = {
      to: email,
      ...confirmationTemplate,
    };

    await this.sendUpdatePasswordMail(msg);
  }

  async sendUpdatePasswordMail(options: ISendMailOptions): Promise<void> {
    try {
      return await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        text: options.text,
        template: 'updatePassword',
        context: options.context,
        attachments: options.attachments,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
