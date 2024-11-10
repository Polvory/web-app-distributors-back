import { Controller, Post, Body, UseGuards, Put, Param, Logger, HttpException, HttpStatus, Get, Query, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../guards/AuthGuard';
import { RolesGuard } from '../guards/RolesGuard';
import { Roles } from '../guards/roles.decorator';
import { ADMIN } from '../config/roles';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { AddTypeAddkDto } from './dto/add-type-add.dto'
import { TypeAddService } from '../type-add/type-add.service'
import { CompleteTaskDto } from './dto/complete-task.dto';
import { TaskStatus } from './tasks.model';
import { ToggleTaskResultDto } from './dto/toggle-task-result.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);
  constructor(
    private readonly tasksService: TasksService,
    private readonly TypeAddService: TypeAddService

  ) { }



  @ApiOperation({ summary: 'Получить все задачи' })
  @ApiResponse({ status: 200, description: 'Задачи получены' })
  @ApiQuery({ name: 'creatorId', required: false, description: 'ID создателя задачи creatorId' })
  @Get('/get')
  async getTasks(@Query('creatorId') creatorId?: string) {
    this.logger.log(`Получаем задачи`);
    try {
      return await this.tasksService.getTasks(creatorId);
    } catch (error) {
      this.logger.error(`Ошибка создания задачи: ${error.message}`);
      throw new HttpException('Ошибка создания задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // @ApiOperation({ summary: 'Получить задачи исполнителя' })
  // @ApiResponse({ status: 200, description: 'Задачи получены' })
  // @Get('/get/executor')
  // @ApiQuery({
  //   name: 'tg_user_id',
  //   required: true,
  //   example: "6935066908",
  // })
  // @ApiQuery({
  //   name: 'completed',
  //   required: true,
  //   example: false,
  // })
  // async getTasksByExecutor(@Query('tg_user_id') tg_user_id: string, @Query('completed') completed: boolean,) {
  //   this.logger.log(`Получаем задачи`);
  //   try {
  //     return await this.tasksService.getTasksByExecutor(tg_user_id, completed);
  //   } catch (error) {
  //     this.logger.error(`Ошибка создания задачи: ${error.message}`);
  //     throw new HttpException('Ошибка создания задачи', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @ApiOperation({ summary: 'Получить задачи исполнителя' })
  @ApiResponse({ status: 200, description: 'Задачи получены' })
  @Get('/get/executor')
  @ApiQuery({
    name: 'tg_user_id',
    required: true,
    example: "6935066908",
  })
  @ApiQuery({
    name: 'completed',
    required: false, // Делаем необязательным для возможности фильтрации только по статусу
    example: false,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TaskStatus, 
    example: TaskStatus.IN_PROGRESS,
  })
  async getTasksByExecutor(
    @Query('tg_user_id') tg_user_id: string,
    @Query('completed') completed?: boolean,
    @Query('status') status?: TaskStatus,
  ) {
    this.logger.log(`Получаем задачи исполнителя`);
    try {
      return await this.tasksService.getTasksByExecutor(tg_user_id, completed, status);
    } catch (error) {
      this.logger.error(`Ошибка получения задач: ${error.message}`);
      throw new HttpException('Ошибка получения задач', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


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
    this.logger.debug(`Назначаем задачу пользователю: ${JSON.stringify(dto)}`, dto.taskId, dto.tg_user_id);
    try {
      return await this.tasksService.assignTaskToUser(dto);
    } catch (error) {
      this.logger.error(`Ошибка назначения задачи: ${error.message}`);
      throw new HttpException('Ошибка назначения задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Добавить тип рекламмы' })
  @ApiResponse({ status: 201, description: 'Реклама добавлена' })
  @Put('/add/type-add')
  async addTypeAdd(@Body() AddTypeAddkDto: AddTypeAddkDto) {
    this.logger.log(`Дабовляем типы рекламмы таск: ${AddTypeAddkDto.taskId}`);
    this.logger.log('Ищем типы рекламы из списка')
    const validateTask = await this.tasksService.validate(AddTypeAddkDto.taskId)
    if (!validateTask) throw new HttpException(`Такой задачи нет: ${AddTypeAddkDto.taskId}`, HttpStatus.NOT_FOUND);
    for (let index = 0; index < AddTypeAddkDto.typeAddIds.length; index++) {
      const element = AddTypeAddkDto.typeAddIds[index];
      this.logger.log(`Ищем типы рекламы: ${element}`)
      const typeAdd = await this.TypeAddService.validate(element)
      if (!typeAdd) {
        this.logger.error(`Реклама с таким id не найдена ${element}`)
        throw new HttpException(`Реклама с таким id не найдена ${element}`, HttpStatus.NOT_FOUND);
      }
      this.logger.log(`Результат поиска ${JSON.stringify(typeAdd)}`)
      const resAddType = await this.tasksService.addTypeAddToTask(AddTypeAddkDto.taskId, element)
      this.logger.log(resAddType)
    }
    return await this.tasksService.validate(AddTypeAddkDto.taskId)
  }

  @ApiOperation({ summary: 'Завершить задачу' })
  @ApiResponse({ status: 200, description: 'Задача завершена' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/complete/:id')
  async completeTask(
    @Param('id') taskId: string,
  ) {
    this.logger.log(`Завершаем задачу с ID: ${taskId}`);
    try {
      return await this.tasksService.completeTask(taskId);
    } catch (error) {
      this.logger.error(`Ошибка завершения задачи: ${error.message}`);
      throw new HttpException('Ошибка завершения задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Проставить чек-бокс (task_result)' })
  @ApiResponse({ status: 200, description: 'Результат задачи обновлен' })
  @Patch('/toggle-result/:taskId')
  async toggleTaskResult(
    @Param('taskId') taskId: string,
    @Body() dto: ToggleTaskResultDto,
  ) {
    this.logger.log(`Обновляем результат задачи с ID: ${taskId}`);
    try {
      return await this.tasksService.toggleTaskResult(taskId, dto);
    } catch (error) {
      this.logger.error(`Ошибка обновления результата задачи: ${error.message}`);
      throw new HttpException('Ошибка обновления результата задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Добавить фото к задаче
  // Загрузить фото -> получить результат загрузки -> Добавить этот результат к





}
