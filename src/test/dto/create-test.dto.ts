import { IsNotEmpty, IsString } from "class-validator";

export class CreateTestDto {
    @IsString ()
    @IsNotEmpty ()
    name: string;
    
    @IsString ()
    @IsNotEmpty ()
    description: string;

    @IsString ()
    @IsNotEmpty ()
    postalCode: number;

    @IsString ()
    @IsNotEmpty ()
    phone: string;
}
