import { Module } from '@nestjs/common';
import { MessagesModule } from 'src/messages/messages.module';
import { PositionsModule } from 'src/positions/positions.module';
import { FtxService } from './ftx.service';

@Module({
  imports: [PositionsModule, MessagesModule],
  providers: [FtxService],
})
export class FtxModule {}
