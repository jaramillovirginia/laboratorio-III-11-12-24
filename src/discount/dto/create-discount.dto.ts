import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDiscountDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    porcentage: number;

    @IsString()
    @IsNotEmpty()
    amount: string;
    
    @IsNumber()
    @IsNotEmpty()
    starDate: Date;

    @IsString()
    @IsNotEmpty()
    endDate: Date;
}
