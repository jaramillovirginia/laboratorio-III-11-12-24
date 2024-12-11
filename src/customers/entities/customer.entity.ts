import { Column, Entity } from "typeorm";
import { BaseEntity } from "./../../common/config/base.entity";

@Entity({name: "customer"})
export class CustomerEntity extends BaseEntity {
    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    contact: string;

    @Column({ type: "varchar" })
    address: string;

    @Column({ type: "varchar" })
    city: string;
    
    @Column({ type: "int" })
    postalCode: number;

    @Column({ type: "varchar" })
    country: string;
}