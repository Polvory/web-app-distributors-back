import { ApiProperty } from "@nestjs/swagger";

export class findAddresses{
    @ApiProperty({ example: 'хуютин', description: 'улица' })
    street: string;
}

export class editAddresses{
    @ApiProperty({ example: '11588ddc-62e8-4b93-b25d-7d2e8c2b9b12', description: 'id' })
    id: string;

    @ApiProperty({ example: 'хуютин', description: 'улица' })
    street?: string;

    @ApiProperty({ example: true, description: 'запись в архив' })
    archiving_an_address?:boolean
}


export class CreateAddresses {
  
    @ApiProperty({ example: 'Хуево кукуево', description: 'улица' })
    street: string;

    @ApiProperty({ example: false, description: 'запись в архив' })
    archiving_an_address: boolean;

    @ApiProperty({ example: 1, description: 'номер дома' })
    house_number: number;

    @ApiProperty({ example: 2, description: 'подъезд' })
    entrance?: number;

    @ApiProperty({ example: '6935066908', description: 'корпус' })
    frame: string;

    @ApiProperty({ example: '6935066908', description: 'район' })
    district: string;

    @ApiProperty({ example: '6935066908', description: 'форма правления' })
    form_of_government: string;

    @ApiProperty({ example: '6935066908', description: 'УК по реформе ЖКХ' })
    МС_for_Housing_and_CSR: string;

    @ApiProperty({ example: false, description: 'дом в договоре' })
    house_under_contract: boolean;

    @ApiProperty({ example: '6935066908', description: 'дата подключения к сети' })
    date_of_connection_to_the_network: string;

    @ApiProperty({ example: 2, description: 'количество подъездов' })
    number_of_entrances: number;

    @ApiProperty({ example: false, description: 'наличие стендов для бесплатной рекламы' })
    availability_of_stands_for_free_advertising: boolean;

    @ApiProperty({ example: '6935066908', description: 'тип стенда' })
    stand_type?: string;

    @ApiProperty({ example: false, description: 'наличие номеров этажей' })
    availability_of_floor_numbers: boolean;

    @ApiProperty({ example: false, description: 'чат жителей дома' })
    house_residents_chat: boolean;

    @ApiProperty({ example: '6935066908', description: 'чей чат' })
    whose_chat: string;

    @ApiProperty({ example: '6935066908', description: 'комментарий' })
    comment: string;

    @ApiProperty({ example: 2, description: 'количество этажей' })
    number_of_floors: number;

    @ApiProperty({ example: 2, description: 'количество квартир' })
    number_of_apartments: number;

    @ApiProperty({ example: 2, description: 'численность жителей' })
    number_of_inhabitants: number;

    @ApiProperty({ example: 2, description: 'территориальный кластер' })
    territorial_cluster: number;
}