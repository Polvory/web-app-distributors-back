import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task, TaskResult } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notification/notification.service'
import { TypeAdd } from '../type-add/type-add.model';
import { TypeAddTasks } from './type-add-tasks.model';
import { addImgesToTask } from '../images/images.interface';
import { CompleteTaskDto } from './dto/complete-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(TypeAddTasks) private readonly TypeAddTasksModel: typeof TypeAddTasks,


    private readonly usersService: UsersService,
    private readonly NotificationService: NotificationService
  ) { }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    try {
      const user = await this.usersService.validateUser(dto.tg_user_id);
      if (!user) {
        this.logger.error(`Пользователь с tg_user_id ${dto.tg_user_id} не найден`);
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      // dto.creatorId = user.id
      this.logger.log(`Добавлен автор: ${user.tg_user_id}`);
      const newTask = await this.taskModel.create(dto);
      newTask.creatorId = user.id

      this.logger.log(`Задача создана: ${newTask.id}`);
      return await newTask.save();
    } catch (error) {
      this.logger.error(`Ошибка создания задачи: ${error.message}`);
      throw new HttpException('Ошибка создания задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addTypeAddToTask(taskId: string, typeAddId: string) {
    try {

      const task = await this.taskModel.findByPk(taskId)
      this.logger.log(`Таска найдена`, JSON.stringify(task))
      if (task && typeAddId) {
        await task.$add('typeAdds', typeAddId);
        return true
      }
      return false;
    } catch (error) {
      this.logger.error(error)
    }

  }

  async validate(id: string) {
    this.logger.log(`Ищем таску : ${id}`)
    return await this.taskModel.findOne({ where: { id: id }, include: { all: true } })
  }


  async findTasksByTypeAddId(typeAddId: string, taskId: string) {
    try {
      const tasks = await this.TypeAddTasksModel.findOne({ where: { taskId: taskId, typeAddId: typeAddId } });
      return tasks;
    } catch (error) {
      console.error('Ошибка при поиске задач по typeAddId:', error);
      throw error;
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


  getDate(date: string) {
    const newdate = new Date(date);
    const formattedDate = newdate.toISOString().split('T')[0];
    return formattedDate
  }

  async assignTaskToUser(dto: AssignTaskDto)
  // : Promise<Task> 
  {
    try {
      const task: any = await this.taskModel.findByPk(dto.taskId);
      if (!task) {
        this.logger.error(`Задача с ID ${dto.taskId} не найдена`);
        throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);
      }

      const user = await this.usersService.validateUser(dto.tg_user_id);
      if (!user) {
        this.logger.error(`Пользователь с tg_user_id ${dto.tg_user_id} не найден`);
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      const creatorNickname: any = await this.usersService.validateUser(task.creatorId);


      if (task.executorId != user.id) {
        this.logger.log(`Переназначили задачу c ${task.executorId} на ${user.id}`)
        const userOld: any = await this.usersService.validateUser(task.executorId);
        this.logger.log(userOld)
        task.executorId = user.id;
        const newDataTask = await task.save();
        const messageToNew = `💚\nПривет! Новая задача\nДата: ${this.getDate(task.date)}\nАдрес: ${task.address} \nАвтор: @${creatorNickname.tg_user_name}`
        const messageToOld = `❌❌❌\nПривет! Задача отменена \nДата: ${this.getDate(task.date)}\nАдрес: ${task.address} \nАвтор: @${creatorNickname.tg_user_name}`
        this.NotificationService.sendTaskAddNotification(String(user.tg_user_id), messageToNew)
        this.NotificationService.sendTaskAddNotification(String(userOld.tg_user_id), messageToOld)
        return newDataTask

      } else {
        this.logger.log(`Задача ${task.id} назначена пользователю ${dto.tg_user_id}`);
        task.executorId = user.id;
        const newDataTask = await task.save();
        const message = `💚\ Привет! Новая задача\nДата: ${this.getDate(task.date)}\nАдрес: ${task.address}\nАвтор: @${creatorNickname.tg_user_name}`
        this.logger.log(message)
        this.NotificationService.sendTaskAddNotification(String(user.tg_user_id), message)
        return newDataTask
      }
    } catch (error) {
      this.logger.error(`Ошибка назначения задачи: ${error.message}`);
      throw new HttpException('Ошибка назначения задачи', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getTasks() {
    return await this.taskModel.findAll({ include: { all: true } })
  }

  async addImages(data: addImgesToTask) {
    const task: Task = await this.validate(data.task_id)
    if (!task) {
      throw new Error(`Задача с ID ${data.task_id} не найдена`);
    }
    const taskResult: TaskResult[] = task.task_result || [];
    const existingResult = taskResult.find((result) => result.typeAddId === data.type_add_id);

    if (existingResult) {
      // Если такой typeAddId уже существует, добавляем новые изображения в массив
      existingResult.images = [...new Set([...existingResult.images, ...data.files])]; // Используем Set для исключения дубликатов
    } else {
      // Если typeAddId не найден, создаем новый объект TaskResult
      const newTaskResult: TaskResult = {
        typeAddId: data.type_add_id,
        passed: false,
        images: data.files,
      };
      taskResult.push(newTaskResult);
    }
    // Обновляем task_result в задаче и сохраняем изменения
    // task.task_result = taskResult;
    // return await task.save();
        // Обновляем task_result в базе данных напрямую
        await this.taskModel.update(
          { task_result: taskResult },
          { where: { id: data.task_id } }
        );
    
        return task; 
  }



  async removeImage(task_id: string, type_add_id: string, imageName: string) {
    const task: Task = await this.validate(task_id);

    if (!task) {
      throw new Error(`Задача с ID ${task_id} не найдена`);
    }

    const taskResult: TaskResult[] = task.task_result || [];
    const existingResult = taskResult.find((result) => result.typeAddId === type_add_id);

    if (existingResult) {
      // Удаляем изображение по имени из массива images
      const updatedImages = existingResult.images.filter((image) => image !== imageName);

      // Проверяем, если после удаления изображений не осталось, можно удалить весь объект
      if (updatedImages.length > 0) {
        existingResult.images = updatedImages;
      } else {
        // Если изображений больше нет, удаляем весь TaskResult из массива
        task.task_result = taskResult.filter((result) => result.typeAddId !== type_add_id);
      }

      // Сохраняем изменения
      await task.save();

      this.logger.log('Удалили изображение из списка', imageName);
    } else {
      this.logger.warn(`TypeAdd с ID ${type_add_id} не найден для задачи`);
    }

    return task;
  }

  // async completeTask(taskId: string, dto: CompleteTaskDto): Promise<Task> {
  //   const task: any = await this.taskModel.findByPk(taskId, { include: { all: true } });
  //   if (!task) {
  //     this.logger.error(`Задача с ID ${taskId} не найдена`);
  //     throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);
  //   }

  //   // Обновление результата задачи
  //   const taskResult = {
  //     typeAddId: dto.typeAddId,
  //     images: dto.images,
  //     passed: true,
  //   };
  //   task.task_result = [...(task.task_result || []), taskResult];
  //   task.completed = dto.completed;

  //   await task.save();
  //   const creatorNickname: any = await this.usersService.validateUser(task.tg_user_id);

  //   const message = `\nЗадача ${taskId} \nЗавершена пользователем ${creatorNickname.tg_user_name}.\nДата: ${this.getDate(task.date)}\nПроверьте результат.`

  //   // Уведомление администратору
  //   if (task.creatorId) {
  //     const creator = await this.usersService.validateUser(task.creatorId);
  //     if (creator) {
  //       await this.NotificationService.sendTaskAddNotification(
  //         String(creator.tg_user_id), message
          
  //       );
  //     }
  //   }

  //   this.logger.log(`Задача с ID ${taskId} успешно завершена`);
  //   return task;
  // }

  async completeTask(taskId: string, dto: CompleteTaskDto): Promise<Task> {
    const task: any = await this.taskModel.findByPk(taskId, { include: { all: true } });
    if (!task) {
      this.logger.error(`Задача с ID ${taskId} не найдена`);
      throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);
    }

    // Инициализация task_result пустым массивом, если он отсутствует
    task.task_result = task.task_result || [];

    // Создаем карту выполнения для всех переданных `typeAddId`
    const completedTypesMap = new Set(dto.completedTypes);

    // Обновление task_result для выполненных типов
    task.task_result = task.task_result.map(result => {
      if (completedTypesMap.has(result.typeAddId)) {
        return { ...result, passed: true };
      }
      return result;
    });

    // Проверяем, что каждый `typeAddId` из dto присутствует в task_result и имеет `passed: true`
    const allTypesCompleted = dto.completedTypes.every(typeId =>
      task.task_result.some(result => result.typeAddId === typeId && result.passed === true)
    );

    task.completed = allTypesCompleted;
    await task.save();

    // Получение информации о пользователе-исполнителе
    const creatorNickname: any = await this.usersService.validateUser(task.tg_user_id);

    // Уведомление администратору о прогрессе выполнения
    if (task.creatorId) {
      const creator = await this.usersService.validateUser(task.creatorId);
      if (creator) {
        const message = allTypesCompleted
          ? `\nЗадача ${taskId} \nПолностью завершена пользователем ${creatorNickname.tg_user_name}.\nДата: ${this.getDate(task.date)}\nПроверьте результат.`
          : `\nЗадача ${taskId} \nЧастично выполнена пользователем ${creatorNickname.tg_user_name}.\nДата: ${this.getDate(task.date)}\nПроверьте прогресс.`;

        await this.NotificationService.sendTaskAddNotification(String(creator.tg_user_id), message);
      }
    }

    this.logger.log(`Задача с ID ${taskId} обновлена: ${allTypesCompleted ? 'выполнена' : 'частично выполнена'}`);
    return task;
}

}
