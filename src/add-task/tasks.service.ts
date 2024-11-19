import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task, TaskResult, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notification/notification.service'
import { TypeAdd } from '../type-add/type-add.model';
import { TypeAddTasks } from './type-add-tasks.model';
import { addImgesToTask } from '../images/images.interface';
import { Users } from 'src/users/users.model';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { ToggleTaskResultDto } from './dto/toggle-task-result.dto';


@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(TypeAddTasks) private readonly TypeAddTasksModel: typeof TypeAddTasks,


    private readonly usersService: UsersService,
    private readonly NotificationService: NotificationService
  ) { }


  // async getTasksByExecutor(tg_user_id: string, completed: boolean) {

  //   const user: Users | false = await this.usersService.validateUser(tg_user_id)
  //   if (user) {
  //     const tasks = await this.taskModel.findAll({
  //       where: { executorId: user.id, completed: completed }, // фильтрация по полю completed в taskModel
  //       include: { all: true },
  //       order: [['createdAt', 'DESC']],
  //     })
  //     return tasks
  //   }

  // }

  async getTasksByExecutor(tg_user_id: string, completed?: boolean, status?: TaskStatus) {
    const user: Users | false = await this.usersService.validateUser(tg_user_id);

    // if (!user) {
    //   throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    // }

    // Формируем условие фильтрации
    const whereCondition: any = {};

    // Учитываем completed, если параметр указан
    if (completed !== undefined) {
      whereCondition.completed = completed;

    }
    if (user !== false) {
      whereCondition.executorId = user.id;
    }
    // Учитываем status, если параметр указан
    if (status !== undefined) {
      whereCondition.status = status;
    }

    // Получаем задачи с фильтрацией по whereCondition
    const tasks = await this.taskModel.findAll({
      where: whereCondition,
      include: { all: true },
      order: [['createdAt', 'DESC']],
    });

    return tasks;
  }


  async createTask(dto: CreateTaskDto)
  // : Promise<Task> 
  {
    try {
      const user = await this.usersService.validateUser(dto.tg_user_id);
      if (!user) {
        this.logger.error(`Пользователь с tg_user_id ${dto.tg_user_id} не найден`);
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      const newTask = await this.taskModel.create(dto);

      this.logger.log(`Назначаем автор: ${user.tg_user_id}`);
      newTask.creator_user_name = user.tg_user_name;

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
        return await this.taskModel.findOne({ where: { id: task.id } })
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


  async getTasks(creatorId?: string) {
    const whereCondition = creatorId ? { creatorId } : {};
    return await this.taskModel.findAll({
      where: whereCondition,
      include: { all: true },
      order: [['createdAt', 'DESC']],
    });
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
        passed: true,
        images: data.files,
      };
      taskResult.push(newTaskResult);

    }
    await this.taskModel.update(
      { task_result: taskResult },
      { where: { id: data.task_id } }
    );
    // const updatedTask = await this.taskModel.findByPk(data.task_id);
    return taskResult;
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



  async completeTask(taskId: string): Promise<Task> {
    const task: any = await this.taskModel.findByPk(taskId, { include: { all: true } });

    if (!task) {
      this.logger.error(`Задача с ID ${taskId} не найдена`);
      throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);
    }



    // Устанавливаем статус на РАССМОТРЕНИЕ
    task.status = TaskStatus.COMPLETED;
    task.completed = true

    await task.save();

    // Получение информации о пользователе-исполнителе
    const creatorNickname: any = await this.usersService.validateUser(task.tg_user_id);

    // Отправка уведомления администратору
    if (task.creatorId) {
      const creator = await this.usersService.validateUser(task.creatorId);
      if (creator) {
        const message = `\nЗадача ${taskId} \nЗавершена пользователем ${creatorNickname.tg_user_name}.\nДата: ${this.getDate(task.date)}\nПроверьте результат.`;

        await this.NotificationService.sendTaskAddNotification(String(creator.tg_user_id), message);
      }
    }

    this.logger.log(`Задача с ID ${taskId} завершена пользователем и отправлена на рассмотрение.`);
    return task;
  }

  async toggleTaskResult(taskId: string, dto: ToggleTaskResultDto): Promise<Task> {
    const task = await this.taskModel.findByPk(taskId);
    this.logger.log(task.id)
    if (!task) {
      throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);
    }

    this.logger.debug(JSON.stringify(task))

    // Инициализация `task_result` как пустого массива, если оно отсутствует
    let taskResult: TaskResult[] = task.task_result = task.task_result || [];

    // Проверка, есть ли уже объект с данным `typeAddId`
    const existingResultIndex = task.task_result.findIndex(
      (result) => result.typeAddId === dto.typeAddId,
    );
    this.logger.debug(`Ищем таску по id: ${JSON.stringify(existingResultIndex)}`)

    if (existingResultIndex != -1) {
      this.logger.warn(`Таска есть`)
      taskResult[existingResultIndex].passed = dto.passed

    } else {
      const payloud = {
        typeAddId: dto.typeAddId,
        passed: dto.passed,
        images: [], // Пустой массив для изображений
      }
      this.logger.warn(`Таски нет`)
      this.logger.warn(JSON.stringify(payloud))
      taskResult.push(payloud)
    }

    // task.task_result[existingResultIndex].passed = dto.passed
    // taskResult = task.task_result

    this.logger.debug(JSON.stringify(taskResult))

    // if (dto.passed) {
    //   // Если чекбокс установлен, добавляем или обновляем объект
    //   if (existingResultIndex !== -1) {
    //     task.task_result[existingResultIndex].passed = dto.passed;
    //   } else {
    //     task.task_result.push({
    //       typeAddId: dto.typeAddId,
    //       passed: dto.passed,
    //       images: [], // Пустой массив для изображений
    //     });
    // }

    //   // Обновляем статус задачи на IN_PROGRESS
    //   task.status = TaskStatus.IN_PROGRESS;
    // } else {
    //   // Если чекбокс снят и `images` пустой, удаляем объект
    //   if (
    //     existingResultIndex !== -1 &&
    //     task.task_result[existingResultIndex].images.length === 0
    //   ) {
    //     task.task_result.splice(existingResultIndex, 1);
    //   }
    // }
    this.logger.debug(JSON.stringify(taskResult))
    await this.taskModel.update(
      { task_result: taskResult, status: task.status },
      { where: { id: taskId } }
    );

    const newTask = await this.taskModel.findOne({ where: { id: taskId }, include: { all: true } });
    // this.logger.warn(JSON.stringify(await newTask))
    return newTask
  }

  async editStatus(task: Task, status: TaskStatus) {
    try {
      task.status = status
      return await task.save()
    } catch (error) {
      throw new HttpException('Не удалсь установить статус!', HttpStatus.NOT_FOUND);
    }


  }

}
