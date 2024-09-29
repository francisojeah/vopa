import { join } from 'path';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
require('dotenv').config();

const {
  EMAIL_USER,
  EMAIL_HOST,
  EMAIL_PASSWORD,
} = process.env;

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          secure: false,
          port: 587,
          host: EMAIL_HOST,
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD,
        }
        },
        defaults: {
          from: `"VOPA" <ojeahfrancis@gmail.com>`,
        },
        template: {
          dir: join(__dirname, '..', '../src/modules/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
