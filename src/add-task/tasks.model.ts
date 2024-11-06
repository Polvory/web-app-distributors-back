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

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  completed: boolean;

  @Column({ type: DataType.STRING })
  image: string;



  @ForeignKey(() => Users)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  creatorId: string;

  @BelongsTo(() => Users)
  creator: Users;


  @ForeignKey(() => Users)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  executorId: string;

  @BelongsTo(() => Users)
  executor: Users;

  @Column({ type: DataType.JSONB })
  task_result: TaskResult[]

  @BelongsToMany(() => TypeAdd, () => TypeAddTasks)
  typeAdds: TypeAdd[];
}
