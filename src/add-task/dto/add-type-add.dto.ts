import { ApiProperty } from "@nestjs/swagger"

export class AddTypeAddkDto {
    @ApiProperty({ example: 'd14f2f25-3397-4867-be06-73bff73b382c', description: 'taskId' })
    taskId: string;

    @ApiProperty({ example: ["41e1b201-efde-49f7-96d1-7cd8000d0803"], description: 'id types massive' })
    typeAddIds: string[];
}
