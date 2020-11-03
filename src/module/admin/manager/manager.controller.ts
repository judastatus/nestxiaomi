import { Config } from './../../../config/config';
import { Controller,Get, Render } from '@nestjs/common';

@Controller(`${Config.adminPath}/manager`)
export class ManagerController {
    @Get()
    @Render('admin/manager/index')
    index() {
        return {};
    }

   
    @Get("add")
    @Render('admin/manager/add')
    addManger() {
        return {};
    }

    @Get("edit")
    @Render('admin/manager/edit')
    editManger() {
        return {};
    }
}
