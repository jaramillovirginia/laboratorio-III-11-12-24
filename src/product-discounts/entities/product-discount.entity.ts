import { DiscountEntity } from "src/discount/entities/discount.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

export class ProductDiscountEntity extends BaseEntity {

    @ManyToOne(() => DiscountEntity, (discount) => discount.productDiscounts)
    @JoinColumn({name: "discount_id"})
    products: string;

    @ManyToOne(() => ProductEntity, (product) => product.productDiscounts)
    @JoinColumn({name: "discount_id"})
    discount: string;
}
