import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @ApiProperty({ example: '2024-11-01', description: 'Дата назначения задачи' })
  date: Date;

  @ApiProperty({ example: 'ул. Пушкина, дом 10', description: 'Адрес задачи' })
  address: string;

  @ApiProperty({ example: 'Листовка', description: 'Тип задачи' })
  taskType: string;

  @ApiProperty({ example: '6935066908', description: 'Исполнитель задачи' })
  tg_user_id: string;

  @ApiProperty({ example: false, description: 'Статус выполнения задачи (по умолчанию false)' })
  completed?: boolean = false;

  @ApiProperty({ example: 'http://image.jpg', description: 'Ссылка на изображение' })
  image?: string;

}
