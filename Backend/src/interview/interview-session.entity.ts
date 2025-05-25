import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("interview_sessions")
export class InterviewSession {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("simple-json", { nullable: true })
  userInfo: Record<string, any>;

  @Column("text")
  transcript: string;

  @Column("simple-json", { nullable: true })
  feedback: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
