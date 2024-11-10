import { ApiProperty } from '@nestjs/swagger';

export class CompleteTaskDto {
  @ApiProperty({ example: ['typeAddId1', 'typeAddId2'], description: 'Список выполненных типов задачи' })
  completedTypes: string[];
}
