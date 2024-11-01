import { ApiProperty } from "@nestjs/swagger"

export class createTypeAdd {

    @ApiProperty({ example: 'Листовка', description: 'Название типа рекламы' })
    name: string

    @ApiProperty({ example: 'Бумажная листовка', description: 'Описание' })
    descripton: string

    @ApiProperty({ example: 9, description: 'Вознаграждение' })
    price: number

    @ApiProperty({ example: false, description: 'Архивация типа рекламы' })
    archive: boolean
}
