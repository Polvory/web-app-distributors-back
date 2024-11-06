import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Task } from './tasks.model';
import { TypeAdd } from '../type-add/type-add.model';

@Table({ tableName: 'type-add-tasks' })
export class TypeAddTasks extends Model<TypeAddTasks> {
    @ForeignKey(() => Task)
    @Column
    taskId: string;

    @ForeignKey(() => TypeAdd)
    @Column
    typeAddId: string;
}