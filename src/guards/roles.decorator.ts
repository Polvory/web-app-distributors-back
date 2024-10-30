import { SetMetadata } from '@nestjs/common';

// Задаем метаданные для ролей
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
