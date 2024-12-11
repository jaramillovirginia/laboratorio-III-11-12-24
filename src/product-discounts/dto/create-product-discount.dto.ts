import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDiscountDto {
    @IsString()
    @IsNotEmpty()
    product: string;

    
    @IsString()
    @IsNotEmpty()
    @IsNumber()
    discount: number;
}
