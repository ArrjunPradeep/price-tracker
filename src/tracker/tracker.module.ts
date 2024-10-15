import { Module } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { TrackerController } from './tracker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price]),
    ScheduleModule.forRoot()
  ],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
