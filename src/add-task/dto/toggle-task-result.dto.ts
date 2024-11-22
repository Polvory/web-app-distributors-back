import { ApiProperty } from '@nestjs/swagger';

export class ToggleTaskResultDto {
  @ApiProperty({ example: '97dfa102-d36d-4e42-bc4e-3c4261198932', description: 'ID типа рекламы' })
  typeAddId: string;

  @ApiProperty({ example: true, description: 'Флаг выполнения (чекбокс)' })
  passed: boolean;
}
