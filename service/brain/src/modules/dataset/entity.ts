import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';

export enum DatasetStatus {
    uploaded = 'UPLOADED',
    extracted = 'EXTRACTED',
    classified = 'CLASSIFIED',
}

@Entity()
@ObjectType()
export class DatasetEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id!: string;

    @Column()
    @Field()
    sourceArchiveUrl!: string;

    @Column({
        type: 'enum',
        enum: DatasetStatus,
        default: DatasetStatus.uploaded,
    })
    @Field()
    status!: DatasetStatus;
}

export type DatasetKey = Pick<DatasetEntity, 'id'>;
export type CreateDataset = Omit<DatasetEntity, 'id'>;

export type DatasetRepository = Repository<DatasetEntity>;
