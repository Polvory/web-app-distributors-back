import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service'

@Controller('notification')
export class NotificationController {

    constructor(
        private NotificationService: NotificationService
    ) {

    }

    @Get()
    async test() {
        await this.NotificationService.sendTaskAddNotification("6182050210", "hi")
    }

}
