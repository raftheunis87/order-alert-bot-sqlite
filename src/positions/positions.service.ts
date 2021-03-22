import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { PositionRepository } from './position.repository';

@Injectable()
export class PositionsService {
  private readonly logger = new Logger(PositionsService.name);

  constructor(
    @InjectRepository(PositionRepository)
    private positionRepository: PositionRepository,
  ) {}

  async createPosition(
    market: string,
    positionSize: number,
    notionalSize: number,
    avgOpenPrice: number,
  ): Promise<Position> {
    return this.positionRepository.createPosition(
      market,
      positionSize,
      this.roundTo(notionalSize, 2),
      avgOpenPrice,
    );
  }

  async updatePosition(
    position: Position,
    positionSize: number,
    notionalSize: number,
    avgOpenPrice: number,
  ): Promise<Position> {
    position.positionSize = positionSize;
    position.notionalSize = this.roundTo(notionalSize, 2);
    position.avgOpenPrice = avgOpenPrice;
    position.cycleBuys = ++position.cycleBuys;

    try {
      await position.save();
      this.logger.verbose(
        `Updated position with id '${position.id}' for market '${position.market}'`,
      );
      return position;
    } catch (error) {
      this.logger.error(
        `Failed to update position with id '${position.id}' for market '${position.market}'`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async closePosition(
    position: Position,
    avgFillPrice: number,
  ): Promise<Position> {
    const profit = this.roundTo(
      position.positionSize * (avgFillPrice - position.avgOpenPrice),
      2,
    );

    position.profit = profit;
    position.isActive = false;

    try {
      await position.save();
      this.logger.verbose(
        `Closed position with id '${position.id}' for market '${position.market}' with a profit of '${position.profit}$'`,
      );
      return position;
    } catch (error) {
      this.logger.error(
        `Failed to close position with id '${position.id}' for market '${position.market}'`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async getPositions(market: string, isActive: boolean): Promise<Position[]> {
    return this.positionRepository.getPositions(market, isActive);
  }

  private roundTo(number: number, decimalPlaces: number): number {
    const factor = 10 ** decimalPlaces;
    return Math.round(number * factor) / factor;
  }
}
