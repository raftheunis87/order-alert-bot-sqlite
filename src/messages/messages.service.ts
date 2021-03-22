import { Injectable, Logger } from '@nestjs/common';
import { Position } from 'src/positions/position.entity';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(private readonly telegramService: TelegramService) {}

  createPositionMessage(position: Position): Promise<void> {
    return this.telegramService.sendCreatePositionMessage(position);
  }

  updatePositionMessage(position: Position): Promise<void> {
    return this.telegramService.sendUpdatePositionMessage(position);
  }

  closePositionMessage(position: Position): Promise<void> {
    return this.telegramService.sendClosePositionMessage(position);
  }
}
