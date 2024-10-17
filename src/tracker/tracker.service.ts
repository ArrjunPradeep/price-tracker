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
  FEE_PERCENTAGE: number;

  constructor(
    @InjectRepository(Price)
    private readonly trackerRepository: Repository<Price>,
    private readonly moralisService: MoralisService,
    private readonly mailService: MailerService
  ) {
  }

  // 1. Automatically save the Price of Ethereum and Polygon every 5 minutes
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const ethPrice = await this.moralisService.getPrice('0x1');
    const polyPrice = await this.moralisService.getPrice('0x89');

    await this.create({ chain: 'ethereum', price: ethPrice });
    await this.create({ chain: 'polygon', price: polyPrice });

  }

  /* Automatically send an email, if the price of a chain 
     increases by more than 3% compared to its price one hour ago
  */
  @Cron(CronExpression.EVERY_HOUR)
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

  // API logic - returning the prices of each hour (within 24hours)
  async getPricesForPast24Hours(): Promise<any> {
    const now = new Date();
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(now.getHours() - 24);

    const prices = await this.trackerRepository.find({
      where: {
        timestamp: Between(twentyFourHoursAgo, now),
      },
      order: { timestamp: 'ASC' } 
    });

    console.log("prices of 242423", prices);

    return prices;
  }

  // API logic - get swap rate (eth to btc)
  async getSwapRate(ethAmount: number): Promise<any> {
    // Get the price of WBTC (BTC equivalent) in terms of ETH
    const wbtcResponse = await this.moralisService.getPriceData("0x1", "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599");

    // Get the price of ETH in USD
    const ethResponse = await this.moralisService.getPriceData("0x1", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");

    const wbtcUsdPrice = wbtcResponse.usdPrice;  // WBTC price in USD
    const ethUsdPrice = ethResponse.usdPrice;    // ETH price in USD
    const ethPerWbtc = wbtcResponse.nativePrice.value / (10 ** wbtcResponse.nativePrice.decimals); // ETH per 1 WBTC

    console.log("124712r84", wbtcUsdPrice, ethUsdPrice, ethPerWbtc)

    const btcReceived = ethAmount / ethPerWbtc;

    const totalFeeEth = ethAmount * (0.03 / 100);

    const totalFeeUsd = totalFeeEth * ethUsdPrice;

    console.log("btcRece", btcReceived);
    console.log("totalFee", totalFeeEth);
    console.log("totalFeeUsd", totalFeeUsd);
    

    return {
      btcReceived,
      totalFeeEth,
      totalFeeUsd,
      btcPriceUsd: wbtcUsdPrice, 
      ethPriceUsd: ethUsdPrice,  
    };
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
