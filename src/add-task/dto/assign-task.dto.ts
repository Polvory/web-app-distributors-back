import { ApiProperty } from "@nestjs/swagger"

export class AssignTaskDto {
  @ApiProperty({ example: 'ef0a82f2-ecb0-4855-b05f-8b053f7b51bb', description: 'taskId' })
  taskId: string;

  @ApiProperty({ example: '2025616110', description: 'userId' })
  tg_user_id: string;
}
