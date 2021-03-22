import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionRepository } from './position.repository';
import { PositionsService } from './positions.service';

@Module({
  imports: [TypeOrmModule.forFeature([PositionRepository])],
  providers: [PositionsService],
  exports: [PositionsService],
})
export class PositionsModule {}
