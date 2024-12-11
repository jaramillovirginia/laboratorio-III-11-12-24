import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "src/common/config/base.entity";

@Entity({name: "discount"})
export class DiscountEntity extends BaseEntity {
    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    description: string;
    
    @Column({ type: "int" })
    porcentage: number;

    @Column({ type: "varchar" })
    amount: string;

    @Column({ type: "varchar" })
    starDate: Date;

    @Column({ type: "varchar" })
    endDate: Date;

    @OneToMany(() => DiscountEntity, (product) => product.productDiscounts)
    productDiscounts: DiscountEntity[];
}
