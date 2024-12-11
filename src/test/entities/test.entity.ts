import { BaseEntity } from "src/common/config/base.entity";

export class TestEntity extends BaseEntity {
    name: string;
    description: string;
    postalCode: number;
    phone: string;
}
