import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    contact: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    city: string;
    
    @IsNumber()
    @IsNotEmpty()
    postalCode: number;

    @IsString()
    @IsNotEmpty()
    country: string;
}
