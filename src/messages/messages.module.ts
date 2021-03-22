import { Module } from '@nestjs/common';
import { TelegramModule } from 'src/telegram/telegram.module';
import { MessagesService } from './messages.service';

@Module({
  imports: [TelegramModule],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
