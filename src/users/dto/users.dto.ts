import { ApiProperty } from "@nestjs/swagger";


export class createUser {

    @ApiProperty({ example: '6935066908', description: 'id юзера' })
    tg_user_id: string

    @ApiProperty({ example: '@Polvory', description: 'тип' })
    tg_user_name?: string;

    @ApiProperty({ example: '', description: 'Авотар в телеграмм' })
    tg_user_image?: string;

    @ApiProperty({ example: 'Стажков Павел Игоревич', description: 'ФИО' })
    full_name?: string

    @ApiProperty({ example: '22-04-1994', description: 'День рождения' })
    birth_date?: string

    @ApiProperty({ example: 'User', description: 'роль' })
    role?: string

    @ApiProperty({ example: 'Днепропетровская 5к2', description: 'Адрес' })
    address?: string
}

export class editeUser {

    @ApiProperty({ example: '6935066908', description: 'id юзера' })
    id: string

    @ApiProperty({ example: '6935066908', description: 'id юзера' })
    tg_user_id: string

    @ApiProperty({ example: 'Стажков Павел Игоревич', description: 'ФИО' })
    full_name: string

    @ApiProperty({ example: '22-04-1994', description: 'День рождения' })
    birth_date: string

    @ApiProperty({ example: 'Днепропетровская 5к2', description: 'Адрес' })
    address: string

    @ApiProperty({ example: '+7 828 288 22 33', description: 'Адрес' })
    phone: string;
}

export class editeRole {

    @ApiProperty({ example: '6935066908', description: 'id юзера' })
    tg_user_id: string

    @ApiProperty({ example: 'Admin', description: 'роль' })
    role: string

}

export class editeBanned {

    @ApiProperty({ example: '6935066908', description: 'id юзера' })
    tg_user_id: string

    @ApiProperty({ example: true, description: 'роль' })
    banned: boolean

}

export class editeValidate {

    @ApiProperty({ example: '6935066908', description: 'id юзера' })
    tg_user_id: string

    @ApiProperty({ example: true, description: 'потверждение роли' })
    validate: boolean

}


