import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { format, toZonedTime } from 'date-fns-tz';

@Entity('price')
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;  // "ethereum" or "polygon"

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  formattedTimestamp: string;

  @CreateDateColumn()
  timestamp: Date;

  @BeforeInsert()
  setFormattedTimestamp() {
    const indiaTimeZone = 'Asia/Kolkata'; // IST timezone
    const zonedTime = toZonedTime(Date.now(), indiaTimeZone); // Convert to IST
    
    // Format as 'DD-MM-YYYY hh:mm:ss A' and save as a string
    this.formattedTimestamp = format(zonedTime, 'dd-MM-yyyy hh:mm:ss aa', { timeZone: indiaTimeZone });
  }
}
