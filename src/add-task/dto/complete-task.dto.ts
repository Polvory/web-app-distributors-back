import { ApiProperty } from '@nestjs/swagger';

export class CompleteTaskDto {
  @ApiProperty({ example: '123', description: 'ID типа рекламы' })
  typeAddId: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], description: 'Список изображений' })
  images: string[];

  @ApiProperty({ example: true, description: 'Флаг выполнения задачи' })
  completed: boolean = true;
}
