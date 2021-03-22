import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Position } from './position.entity';

@EntityRepository(Position)
export class PositionRepository extends Repository<Position> {
  private readonly logger = new Logger(PositionRepository.name);

  async getPositions(market: string, isActive: boolean): Promise<Position[]> {
    const query = this.createQueryBuilder('position');
    query.andWhere('position.market = :market', { market });
    query.andWhere('position.isActive = :isActive', { isActive });

    try {
      const positions = await query.getMany();
      this.logger.verbose(
        `Returning ${positions.length} position(s) for market '${market}'`,
      );
      return positions;
    } catch (error) {
      this.logger.error('Failed to get positions from the database', error);
      throw new InternalServerErrorException();
    }
  }

  async createPosition(
    market: string,
    positionSize: number,
    notionalSize: number,
    avgOpenPrice: number,
  ): Promise<Position> {
    const position = this.create();
    position.market = market;
    position.positionSize = positionSize;
    position.notionalSize = notionalSize;
    position.avgOpenPrice = avgOpenPrice;
    try {
      await position.save();
    } catch (error) {
      this.logger.error(
        `Failed to create position for market '${market}'`,
        error,
      );
      throw new InternalServerErrorException();
    }

    this.logger.verbose(
      `Created position with id '${position.id}' for market '${position.market}'`,
    );

    return position;
  }
}
