import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

class LogInDto {
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    public password: string;
}

export default LogInDto;