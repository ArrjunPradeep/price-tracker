import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { SwapRateDto } from './dto/swarp-rate.dto';
import { SetAlertDto } from './dto/set-alert.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpRestApiSwapRateBody } from './documentation/HttpRestAPISwapRateBody';
import { HttpRestApiSetAlertBody } from './documentation/HttpRestAPISetAlertBody';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @ApiTags('Price Tracker')
  @Get('getPrices')
  @ApiOperation({
    summary: 'Get Prices of each hour',
    description: `This endpoint allows for retreiving the ethereum and polygon prices of each hour `
  })
  getPrices24hours() {
    return this.trackerService.getPricesForPast24Hours();
  }

  @ApiTags('Price Tracker')
  @Post('setAlert')
  @ApiOperation({
    summary: 'Setting Alert for specific price',
    description: `This endpoint allows to trigger an alert and send the mail if price jumps above the triggered value `
  })
  async setAlert(@Body() body: HttpRestApiSetAlertBody) {
    const { chain, price, email } = body;
    return this.trackerService.createAlert(chain, price, email);
  }

  @ApiTags('Price Tracker')
  @Post('swapRate')
  @ApiOperation({
    summary: 'Get Swap rate of ETH to BTC',
    description: `This endpoint allows to swap ETH to BTC `
  })
  getSwapRate(@Body() body: HttpRestApiSwapRateBody) {
    const {amount} = body;
    return this.trackerService.getSwapRate(amount);
  }

}
