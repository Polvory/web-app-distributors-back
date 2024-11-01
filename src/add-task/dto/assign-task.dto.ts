import { ApiProperty } from "@nestjs/swagger"

export class AssignTaskDto {
  @ApiProperty({ example: '123', description: 'taskId' })
  taskId: string;

  @ApiProperty({ example: '123', description: 'userId' })
  tg_user_id: string;
}
