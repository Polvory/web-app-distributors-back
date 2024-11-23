import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize'
import { Users } from '../users/users.model';
import { TypeAdd } from '../type-add/type-add.model';
import { TypeAddTasks } from './type-add-tasks.model';

export interface TaskResult {
  typeAddId: string;              // Уникальный идентификатор ссылки
  images: string[];
  passed: boolean          // URL страницы
}

export enum TaskStatus {
  NEW_TASK = 'НОВАЯ',
  IN_PROGRESS = 'В РАБОТЕ',
  UNDER_REVIEW = 'НА РАССМОТРЕНИЕ',
  COMPLETED = 'ЗАВЕРШЕНА',
  REVISE = 'ДОРАБОТАТЬ',
}


@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  @Column({ type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true })
  id: string;

  @Column({ type: DataType.DATE })
  date: Date;

  @Column({ type: DataType.STRING })
  address: string;

  @Column({ type: DataType.STRING })
  taskType: string;

  @Column({ type: DataType.STRING })
  tg_user_id: string;

  @Column({ type: DataType.STRING })
  creator_user_name: string;


  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  completed: boolean;

  @Column({ type: DataType.STRING })
  image: string;

  @Column({ type: DataType.ENUM(...Object.values(TaskStatus)), allowNull: false, defaultValue: TaskStatus.NEW_TASK })
  status: TaskStatus;









  @ForeignKey(() => Users)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  executorId: string;

  @BelongsTo(() => Users)
  executor: Users;

  @Column({ type: DataType.JSON })
  task_result: TaskResult[]

  @BelongsToMany(() => TypeAdd, () => TypeAddTasks)
  typeAdds: TypeAdd[];
}
