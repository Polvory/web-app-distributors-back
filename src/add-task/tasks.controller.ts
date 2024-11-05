import { Controller, Post, Body, UseGuards, Put, Param, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../guards/AuthGuard';
import { RolesGuard } from '../guards/RolesGuard';
import { Roles } from '../guards/roles.decorator';
import { ADMIN } from '../config/roles';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';


@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);
  constructor(private readonly tasksService: TasksService) { }

  @ApiOperation({ summary: 'Создать задачу' })
  @ApiResponse({ status: 201, description: 'Задача создана' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ADMIN)
  @Post('/create')
  async createTask(@Body() dto: CreateTaskDto) {
    this.logger.log(`Создаем задачу: ${JSON.stringify(dto)}`);
    try {
      return await this.tasksService.createTask(dto);
    } catch (error) {
      this.logger.error(`Ошибка создания задачи: ${error.message}`);
      throw new HttpException('Ошибка создания задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Редактировать задачу' })
  @ApiResponse({ status: 200, description: 'Задача отредактирована' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ADMIN)
  @Put('/edit/:id')
  async editTask(@Param('id') id: string, @Body() dto: CreateTaskDto) {
    this.logger.log(`Редактируем задачу с ID: ${id}`);
    try {
      return await this.tasksService.editTask(id, dto);
    } catch (error) {
      this.logger.error(`Ошибка редактирования задачи: ${error.message}`);
      throw new HttpException('Ошибка редактирования задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Назначить задачу пользователю' })
  @ApiResponse({ status: 200, description: 'Задача назначена пользователю' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ADMIN)
  @Post('/assign')
  async assignTaskToUser(@Body() dto: AssignTaskDto) {
    this.logger.log(`Назначаем задачу пользователю: ${JSON.stringify(dto)}`);
    try {
      return await this.tasksService.assignTaskToUser(dto);
    } catch (error) {
      this.logger.error(`Ошибка назначения задачи: ${error.message}`);
      throw new HttpException('Ошибка назначения задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
