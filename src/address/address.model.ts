import { DataTypes } from 'sequelize';
import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';



export interface AddressesAttrs {
    street: string;
    house_number: string;
    entrance: string;
    archiving_an_address: string;
}

@Table({ tableName: 'Adresses' })
export class Addresses extends Model<Addresses, AddressesAttrs> {
    @Column({ type: DataType.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true })
    id: string;
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    archiving_an_address: boolean;
    @Column({ type: DataType.TEXT })
    street: string;
    @Column({ type: DataType.INTEGER })
    house_number: number;
    @Column({ type: DataType.INTEGER })
    entrance?: number;
    @Column({ type: DataType.STRING })
    frame: string;
    @Column({ type: DataType.STRING })
    district: string;
    @Column({ type: DataType.STRING })
    form_of_government: string;
    @Column({ type: DataType.STRING })
    MC_for_Housing_and_CSR: string;
    @Column({ type: DataType.STRING })
    house_under_contract: string;
    @Column({ type: DataType.STRING })
    date_of_connection_to_the_network: string;
    @Column({ type: DataType.INTEGER })
    number_of_entrances: number;
    @Column({ type: DataType.BOOLEAN })
    availability_of_stands_for_free_advertising: boolean;
    @Column({ type: DataType.STRING })
    stand_type?: string;
    @Column({ type: DataType.BOOLEAN })
    availability_of_floor_numbers: boolean;
    @Column({ type: DataType.BOOLEAN })
    house_residents_chat: boolean;
    @Column({ type: DataType.STRING })
    whose_chat: string;
    @Column({ type: DataType.STRING })
    comment: string;
    @Column({ type: DataType.INTEGER })
    number_of_floors: number;
    @Column({ type: DataType.INTEGER })
    number_of_apartments: number;
    @Column({ type: DataType.INTEGER })
    number_of_inhabitants: number;
    @Column({ type: DataType.INTEGER })
    territorial_cluster: number;







}

