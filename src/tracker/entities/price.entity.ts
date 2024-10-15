import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('price')
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;  // "ethereum" or "polygon"

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  timestamp: Date;
}