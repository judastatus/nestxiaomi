import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin/main')
export class MainController {

    @Get('welcome')
    @Render('admin/main/welcome')
    welcome() {
        return {};
    }

    @Get()
    @Render('admin/main/index')
    index() {
        return {};
    }
}
