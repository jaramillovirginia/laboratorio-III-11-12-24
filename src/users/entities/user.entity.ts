import { BaseEntity } from "./../../common/config/base.entity";
import { UserGender } from "../../common/enums/user-gender.enum";
import { UserRole } from "../../common/enums/user-role.enum";
import { Column, Entity } from "typeorm";

@Entity('user')
export class UserEntity extends BaseEntity{

    @Column({type: "varchar"})
    name: string;

    @Column({type: "enum", enum: UserGender})
    gender: UserGender;

    @Column({type: "varchar"})
    email: string;

    @Column({type: "varchar"})
    password: string;

    @Column({type: "varchar", nullable: true})
    photo?: string;

    @Column({type: "enum", enum: UserRole, default: UserRole.USER})
    role: UserRole;
}
