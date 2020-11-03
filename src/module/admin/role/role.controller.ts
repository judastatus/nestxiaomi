import { ToolsService } from './../../../service/tools/tools.service';
import { Config } from './../../../config/config';
import { RoleService } from './../../../service/role/role.service';
import { Body, Controller, Get, Post, Render,Response,Query } from '@nestjs/common';
import { Console } from 'console';

@Controller(`${Config.adminPath}/role`)
export class RoleController {
    constructor(private  roleService:RoleService, private toolsService:ToolsService){}

    @Get()
    @Render('admin/role/index')
    async index() {
        var result = await this.roleService.find();
        console.log(result);
        return {
            roleList : result
        };
    }

    @Get('add')
    @Render('admin/role/add')
    async addRole() {
        return {};
    }

    @Post('doAdd')
    async doAdd(@Body() body, @Response() res) {
        console.log('doadd doadd');
        console.log(body);
        
        if (body.title != '') {
            var result = await this.roleService.add(body);

            if (result) {
                this.toolsService.success(res, `/${Config.adminPath}/role`);
            } else {
                this.toolsService.error(res, '增加失败', `/${Config.adminPath}/role`);

            }
        } else {
            this.toolsService.error(res, '标题不能为空', `/${Config.adminPath}/role`);
        }
    }

    @Get('edit')
    @Render('admin/role/edit')
    async edit(@Query() query) {
        var result = await this.roleService.find({ "_id": query.id });
        return {
            roleList: result[0]
        };
    }

    @Post('doEdit')
    async doEdit(@Body() body, @Response() res) {
        console.log(body);
        if (body.title != '') {
            var result = await this.roleService.update({ "_id": body._id }, body);
            if (result) {
                this.toolsService.success(res, `/${Config.adminPath}/role`);
            } else {
                this.toolsService.error(res, '增加失败', `/${Config.adminPath}/role`);
            }

        } else {
            this.toolsService.error(res, '标题不能为空', `/${Config.adminPath}/role`);
        }
    }


    @Get('delete')  
    async delete(@Query() query,@Response() res) {
        var result = await this.roleService.delete({ "_id": query.id });
        console.log(result);
        this.toolsService.success(res, `/${Config.adminPath}/role`);
    }
}
