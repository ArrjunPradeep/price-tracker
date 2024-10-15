import { Injectable } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrackerService {

  constructor(
    @InjectRepository(Price)
    private readonly trackerRepository: Repository<Price>) {
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
