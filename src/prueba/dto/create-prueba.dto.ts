import { IsNotEmpty, IsString } from "class-validator";

export class CreatePruebaDto {
    @IsString ()
    @IsNotEmpty ()
    name: string;
    
    @IsString ()
    @IsNotEmpty ()
    description: string;
}
