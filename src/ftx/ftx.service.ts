import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Position } from 'src/positions/position.entity';
import { PositionsService } from 'src/positions/positions.service';
import * as Api from 'ftx-api-rest';
import * as Websocket from 'ftx-api-ws';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class FtxService {
  private account: any;
  private api: Api;
  private readonly logger = new Logger(FtxService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly positionsService: PositionsService,
    private readonly messagesService: MessagesService,
  ) {
    this.account = this.configService.get('ftx.account');
    this.api = new Api(this.account);
    this.startWebsocket();
  }

  async startWebsocket(): Promise<void> {
    const ftxWS = new Websocket(this.account);
    await ftxWS.connect();
    ftxWS.subscribe('orders');
    ftxWS.on('orders', (order) => {
      if (this.isUnfilledOrder(order)) return;
      if (!this.isClosedMarketOrder(order)) return;
      this.processOrder(order);
    });
  }

  processOrder(order): Promise<Position> {
    if (order.side === 'buy') {
      return this.processBuyOrder(order);
    }
    return this.processSellOrder(order);
  }

  async processBuyOrder(order): Promise<Position> {
    this.logger.verbose(`Processing buy order for market '${order.market}'`);

    // check in DB if active position is present
    const positions: Position[] = await this.positionsService.getPositions(
      order.market,
      true,
    );

    if (positions.length == 0) {
      // no active position, create a new one
      return this.createPosition(order.market);
    }

    if (positions.length == 1) {
      // active position found, update it
      return this.updatePosition(positions[0]);
    }

    if (positions.length > 1) {
      // more then one active position found, throw error
      this.logger.error(
        `Unable to process order, since there is more then one active position found in the database for market '${order.market}'`,
      );
      throw new InternalServerErrorException();
    }
  }

  async processSellOrder(order): Promise<Position> {
    this.logger.verbose(`Processing sell order for market '${order.market}'`);

    // check in DB if active position is present
    const positions: Position[] = await this.positionsService.getPositions(
      order.market,
      true,
    );

    if (positions.length == 1) {
      return this.closePosition(positions[0], Number(order.avgFillPrice));
    } else {
      this.logger.error(
        `Unable to close position for market '${order.market}' because of invalid database data`,
      );
      throw new InternalServerErrorException();
    }
  }

  async createPosition(market: string): Promise<Position> {
    this.logger.verbose(`Creating a new position for market '${market}'`);

    const exchangePositions = await this.getExchangePositions();
    const filteredExchangePositions = exchangePositions.result.filter(
      (exchangePosition) => {
        return exchangePosition.future === market && exchangePosition.size > 0;
      },
    );

    if (filteredExchangePositions.length == 1) {
      // active position found on the exchange, create new position in the database
      const filteredExchangePosition = filteredExchangePositions[0];
      const position: Position = await this.positionsService.createPosition(
        filteredExchangePosition.future,
        Number(filteredExchangePosition.size),
        Number(filteredExchangePosition.cost),
        Number(filteredExchangePosition.recentAverageOpenPrice),
      );

      this.messagesService.createPositionMessage(position);

      return position;
    } else {
      this.logger.error(
        `Failed to create a new position for market '${market}', no open position found on the exchange`,
      );
      throw new InternalServerErrorException();
    }
  }

  async updatePosition(position: Position): Promise<Position> {
    this.logger.verbose(
      `Updating the position for market '${position.market}'`,
    );

    const exchangePositions = await this.getExchangePositions();
    const filteredExchangePositions = exchangePositions.result.filter(
      (exchangePosition) => {
        return (
          exchangePosition.future === position.market &&
          exchangePosition.size > 0
        );
      },
    );

    if (filteredExchangePositions.length == 1) {
      const filteredExchangePosition = filteredExchangePositions[0];
      const updatedPosition: Position = await this.positionsService.updatePosition(
        position,
        Number(filteredExchangePosition.size),
        Number(filteredExchangePosition.cost),
        Number(filteredExchangePosition.recentAverageOpenPrice),
      );

      this.messagesService.updatePositionMessage(position);

      return updatedPosition;
    } else {
      this.logger.error(
        `Failed to update the position for market '${position.market}', no open position found on the exchange`,
      );
      throw new InternalServerErrorException();
    }
  }

  async closePosition(
    position: Position,
    avgFillPrice: number,
  ): Promise<Position> {
    this.logger.verbose(`Closing the position for market '${position.market}'`);

    const closedPosition: Position = await this.positionsService.closePosition(
      position,
      avgFillPrice,
    );

    this.messagesService.closePositionMessage(position);

    return closedPosition;
  }

  async getExchangePositions() {
    return this.api.request({
      method: 'GET',
      path: '/positions?showAvgPrice=true',
    });
  }

  isUnfilledOrder(order) {
    return order.filledSize === 0;
  }

  isClosedMarketOrder(order) {
    return order.type === 'market' && order.status === 'closed';
  }
}
