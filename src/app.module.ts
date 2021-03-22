import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionsModule } from './positions/positions.module';
import { TelegramModule } from './telegram/telegram.module';
import { FtxModule } from './ftx/ftx.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/schema';
import { MessagesModule } from './messages/messages.module';
import * as Joi from '@hapi/joi';
import app from './config/app.config';
import telegram from './config/telegram.config';
import ftx from './config/ftx.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [app, telegram, ftx],
      validationOptions: {
        allowUnknowns: false,
      },
      validationSchema: Joi.object(validationSchema),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PositionsModule,
    TelegramModule,
    FtxModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
