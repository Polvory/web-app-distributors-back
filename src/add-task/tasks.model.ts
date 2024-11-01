import { Column, DataType,  Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize'

@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  @Column({ type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true})
  id: string;

  @Column({type: DataType.DATE})
  date: Date;

  @Column({type: DataType.STRING})
  address: string;

  @Column({type: DataType.STRING})
  taskType: string;

  @Column({type: DataType.STRING})
  tg_user_id: string;

  @Column({type: DataType.BOOLEAN, defaultValue: false})
  completed: boolean;

  @Column({type: DataType.STRING})
  image: string;
}
