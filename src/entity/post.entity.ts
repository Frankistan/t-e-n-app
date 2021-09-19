import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "post" })
export class PostEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 150 })
    title: string;

    @Column({ type: "text" })
    content: string;

    @Column({ nullable: true })
    featured_img: string

    @Column({ name: 'created_at', nullable: true })
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'updated_at', nullable: true })
    @CreateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => UserEntity, user => user.posts)
    author: UserEntity;
}
