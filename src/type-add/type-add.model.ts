import { Model, Table, Column, DataType, BelongsToMany } from "sequelize-typescript";
import { DataTypes } from 'sequelize'
import { Task } from "../add-task/tasks.model";
import { TypeAddTasks } from "../add-task/type-add-tasks.model";


@Table({ tableName: 'type-add' })
export class TypeAdd extends Model<TypeAdd> {

    @Column({ type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, unique: true })
    name: string;

    @Column({ type: DataType.INTEGER })
    price: number

    @Column({ type: DataType.TEXT })
    descripton: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    archive: boolean

    @BelongsToMany(() => Task, () => TypeAddTasks)
    tasks: Task[];
}
