import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  timestamp: Date;
}
