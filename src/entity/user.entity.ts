import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from "typeorm";
import { PostEntity } from "./post.entity";
import bcrypt from "bcrypt";

// fuente:
// https://www.npmjs.com/package/class-validator

@Entity({ name: "user" })
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ type: "varchar" })
    password: string;

    @Column({ type: "varchar", length: 100 })
    username: string;

    @Column({ type: "varchar", nullable: true })
    avatar: string;

    @Column({ type: "varchar", default: "reader" })
    role: string;

    @Column({ name: 'created_at', nullable: true })
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'updated_at', nullable: true })
    @CreateDateColumn()
    updatedAt: Date;

    @Column({ name: 'email_verified', default: 0 })
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
