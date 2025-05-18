import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [EventsModule],
  providers: [TransactionsService],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
