import { Model, Table, Column, DataType, BelongsToMany, HasMany } from "sequelize-typescript";
import { DataTypes } from 'sequelize'
import { Task } from "../add-task/tasks.model";

interface UsersCreationAttrs {
    id: string;
    tg_user_id: string | number;
    tg_user_name?: string;
    tg_user_image: string;
    full_name: string;
    birth_date: string;
    banned: boolean;
    role: string;
    password: string;
    address: string;
    phone: string;
    validate_role: boolean;
}



@Table({ tableName: 'users' })
export class Users extends Model<Users, UsersCreationAttrs> {

    @Column({ type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, unique: true })
    tg_user_id: string | number;

    @Column({ type: DataType.TEXT })
    tg_user_name: string;

    @Column({ type: DataType.STRING })
    tg_user_image: string;


    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    banned: boolean;

    @Column({ type: DataType.STRING })
    full_name: string;

    @Column({ type: DataType.STRING })
    birth_date: string;

    @Column({ type: DataType.STRING })
    role: string;

    @Column({ type: DataType.STRING })
    password: string;

    @Column({ type: DataType.TEXT })
    address: string;

    @Column({ type: DataType.STRING })
    phone: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    validate_role: boolean

    @HasMany(() => Task)
    tasks: Task[];
}
