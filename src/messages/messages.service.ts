import { Injectable, Logger } from '@nestjs/common';
import { Position } from 'src/positions/position.entity';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(private readonly telegramService: TelegramService) {}

  createPositionMessage(position: Position): Promise<void> {
    return this.telegramService.send(
      `New Position\nMarket: ${position.market}\nPosition Size: ${
        position.positionSize
      } ${position.market.replace('-PERP', '')}\nNotional Size: US$${
        position.notionalSize
      }\nAverage Open Price: ${this.roundTo(
        position.avgOpenPrice,
        7,
      )}\nCycle Buys: ${position.cycleBuys}`,
    );
  }

  updatePositionMessage(position: Position): Promise<void> {
    return this.telegramService.send(
      `Update Position\nMarket: ${position.market}\nPosition Size: ${
        position.positionSize
      } ${position.market.replace('-PERP', '')}\nNotional Size: US$${
        position.notionalSize
      }\nAverage Open Price: ${this.roundTo(
        position.avgOpenPrice,
        7,
      )}\nCycle Buys: ${position.cycleBuys}`,
    );
  }

  closePositionMessage(position: Position): Promise<void> {
    return this.telegramService.send(
      `Close Position\nMarket: ${position.market}\nPosition Size: ${
        position.positionSize
      } ${position.market.replace('-PERP', '')}\nNotional Size: US$${
        position.notionalSize
      }\nAverage Open Price: ${this.roundTo(
        position.avgOpenPrice,
        7,
      )}\nCycle Buys: ${position.cycleBuys}\nProfit: ${
        position.profit < 0 ? '-' : ''
      }US$${Math.abs(position.profit)}`,
    );
  }

  private roundTo(number: number, decimalPlaces: number): number {
    const factor = 10 ** decimalPlaces;
    return Math.round(number * factor) / factor;
  }
}
