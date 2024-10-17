import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { SwapRateDto } from './dto/swarp-rate.dto';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post()
  create(@Body() createTrackerDto: CreateTrackerDto) {
    return this.trackerService.create(createTrackerDto);
  }

  @Get()
  findAll() {
    return this.trackerService.findAll();
  }

  @Get('getPrices')
  getPrices24hours() {
    return this.trackerService.getPricesForPast24Hours();
  }

  @Post('swapRate')
  getSwapRate(@Body() swapRateDto: SwapRateDto) {
    const {amount} = swapRateDto;
    return this.trackerService.getSwapRate(amount);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackerDto: UpdateTrackerDto) {
    return this.trackerService.update(+id, updateTrackerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackerService.remove(+id);
  }
}
