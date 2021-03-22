import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as moment from 'moment';

@Entity()
export class Position extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  market: string;

  @Column({ nullable: false })
  positionSize: number;

  @Column({ nullable: false })
  notionalSize: number;

  @Column({ nullable: false })
  avgOpenPrice: number;

  @Column({ nullable: false, default: 1 })
  cycleBuys: number;

  @Column({ nullable: true })
  profit: number;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @BeforeInsert()
  changeCreatedAt() {
    this.createdAt = moment.utc().toDate();
  }

  @BeforeUpdate()
  chaneUpdatedAt() {
    this.updatedAt = moment.utc().toDate();
  }
}
