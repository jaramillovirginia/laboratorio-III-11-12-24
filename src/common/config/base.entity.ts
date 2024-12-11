import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
    
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    @Column({type: 'boolean', default: true})
    isActive: boolean;
}