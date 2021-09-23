import { IsOptional, IsString } from "class-validator";
import { UserEntity } from "../entity/user.entity";


class PostDto {

    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    @IsOptional()
    featured_img: string;

    author: UserEntity;
}

export default PostDto;
