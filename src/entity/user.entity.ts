import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from "typeorm";
import { PostEntity } from "./post.entity";
import bcrypt from "bcrypt";
import { IsEmail, IsNotEmpty, IsString, MinLength, IsUrl, IsBoolean } from "class-validator";

// fuente:
// https://www.npmjs.com/package/class-validator

@Entity({ name: "user" })
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column({ type: "varchar", length: 20 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @Column({ type: "varchar", length: 100 })
    @IsString()
    username: string;

    @Column({ type: "varchar", nullable: true })
    @IsString()
    @IsUrl()
    avatar: string;

    @Column({ type: "varchar" })
    @IsString()
    role: string = "reader";


    @Column({ name: 'created_at', nullable: true })
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'updated_at', nullable: true })
    @CreateDateColumn()
    updatedAt: Date;

    @Column({ name: 'email_verified', default: 0 })
    @IsBoolean()
    emailVerified: boolean;

    // RELATIONS
    @ManyToOne(() => UserEntity, user => user.posts)
    author: UserEntity;

    @OneToMany(() => PostEntity, post => post.author)
    posts: PostEntity[];


    // METHODS
    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }



}
