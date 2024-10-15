import { Injectable } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoralisService } from './moralis.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TrackerService {

  constructor(
    @InjectRepository(Price)
    private readonly trackerRepository: Repository<Price>,
    private readonly moralisService: MoralisService
  ) {
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const ethPrice = await this.moralisService.getPrice('0x1');
    const polyPrice = await this.moralisService.getPrice('0x89');

    await this.create({chain: 'ethereum', price: ethPrice});
    await this.create({chain: 'polygon', price: polyPrice});
  }

  async create(createTrackerDto: CreateTrackerDto) {
    const tracker = this.trackerRepository.create(createTrackerDto);
    return await this.trackerRepository.save(tracker);
  }

  async findAll() {
    return await this.trackerRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} tracker`;
  }

  update(id: number, updateTrackerDto: UpdateTrackerDto) {
    return `This action updates a #${id} tracker`;
  }

  remove(id: number) {
    return `This action removes a #${id} tracker`;
  }
}
