import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task) private readonly taskModel: typeof Task,
    private readonly usersService: UsersService
  ) {}

  async createTask(dto: CreateTaskDto): Promise<Task> {
    try {
      const newTask = await this.taskModel.create(dto);
      this.logger.log(`Задача создана: ${newTask.id}`);
      return newTask;
    } catch (error) {
      this.logger.error(`Ошибка создания задачи: ${error.message}`);
      throw new HttpException('Ошибка создания задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editTask(id: string, dto: CreateTaskDto): Promise<Task> {
    try {
      const task = await this.taskModel.findByPk(id);
      if (!task) {
        this.logger.error(`Задача с ID ${id} не найдена`);
        throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);
      }
      await task.update(dto);
      this.logger.log(`Задача отредактирована: ${task.id}`);
      return task;
    } catch (error) {
      this.logger.error(`Ошибка редактирования задачи: ${error.message}`);
      throw new HttpException('Ошибка редактирования задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async assignTaskToUser(dto: AssignTaskDto): Promise<Task> {
    try {
      const task = await this.taskModel.findByPk(dto.taskId);
      if (!task) {
        this.logger.error(`Задача с ID ${dto.taskId} не найдена`);
        throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);
      }

      const user = await this.usersService.validateUser(dto.tg_user_id);
      if (!user) {
        this.logger.error(`Пользователь с tg_user_id ${dto.tg_user_id} не найден`);
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      task.tg_user_id = dto.tg_user_id;
      await task.save();

      this.logger.log(`Задача ${task.id} назначена пользователю ${dto.tg_user_id}`);
      return task;
    } catch (error) {
      this.logger.error(`Ошибка назначения задачи: ${error.message}`);
      throw new HttpException('Ошибка назначения задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
