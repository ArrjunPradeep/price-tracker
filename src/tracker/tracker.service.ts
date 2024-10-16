import { Injectable } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Between, LessThanOrEqual, Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoralisService } from './moralis.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TrackerService {

  constructor(
    @InjectRepository(Price)
    private readonly trackerRepository: Repository<Price>,
    private readonly moralisService: MoralisService,
    private readonly mailService: MailerService
  ) {
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    const ethPrice = await this.moralisService.getPrice('0x1');
    const polyPrice = await this.moralisService.getPrice('0x89');

    await this.create({ chain: 'ethereum', price: ethPrice });
    await this.create({ chain: 'polygon', price: polyPrice });
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleHourlyCheck() {
    const prices = await this.findAll();
  
    for (const price of prices) {
      // Get the current time and subtract one hour
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
      // Query the price from exactly one hour ago based on timestamp
      const previousPrice = await this.trackerRepository.findOne({
        where: {
          chain: price.chain,
          timestamp: LessThanOrEqual(oneHourAgo),  
        },
        order: { timestamp: 'DESC' },
      });

      console.log("21er1tge1", previousPrice)
  
      // Check if the price increased by more than 3%
      if (previousPrice && (price.price - previousPrice.price) / previousPrice.price > 0.03) {
        await this.sendMail('Price increased by 3%', 'Alert: Price Alert');
      }
    }
  }
  

  async sendMail(message: string, subject: string) {
    const messageBody = message;
    const subjectBody = subject
    console.log("SENDINGGGG");

    return await this.mailService.sendMail({
      from: 'Agent <agent@demomailtrap.com>',
      to: 'wodif66632@chainds.com',
      subject: subject,
      text: message,
    });

  }

  async getPricesForPast24Hours(): Promise<any> {
    const now = new Date();
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(now.getHours() - 24);

    // Query to get all price data points from the last 24 hours
    const prices = await this.trackerRepository.find({
      where: {
        timestamp: Between(twentyFourHoursAgo, now),
      },
      order: { timestamp: 'ASC' }  // Order by ascending timestamp
    });

    console.log("prices of 242423", prices);

    return prices;
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
