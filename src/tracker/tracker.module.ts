import { Module } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { TrackerController } from './tracker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { MoralisService } from './moralis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [
        ConfigModule,
      ],
      useFactory: async(configService: ConfigService) => ({
        transport: {
          // Configuring the email transport host (SMTP server)
          host: configService.get('EMAIL_HOST'),
          // Configuring the email transport port
          port: configService.get('EMAIL_PORT'),
          // Disabling secure connection (not using SSL/TLS)
          secure: false,
          auth: {
            // SMTP authentication: username for the email service
            user: configService.get('EMAIL_USERNAME'),
            // SMTP authentication: password for the email service
            pass: configService.get('EMAIL_PASSWORD')
          },
        }
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Price]),
    ScheduleModule.forRoot()
  ],
  controllers: [TrackerController],
  providers: [TrackerService, MoralisService],
})
export class TrackerModule {}
