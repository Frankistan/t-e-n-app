import { IsEmail, IsNotEmpty, IsString, MinLength, IsUrl, IsOptional, IsEnum } from "class-validator";
import { Permissions } from "../interfaces/permission.interface";


export class UserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    avatar: string;

    @IsString()
    @IsEnum(Permissions, { each: true })
    readonly role: Permissions[];
}
