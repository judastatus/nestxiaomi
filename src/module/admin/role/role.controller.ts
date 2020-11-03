import { RoleAccessService } from './../../../service/role-access/role-access.service';
import { AccessService } from './../../../service/access/access.service';
import { ToolsService } from './../../../service/tools/tools.service';
import { Config } from './../../../config/config';
import { RoleService } from './../../../service/role/role.service';
import { Body, Controller, Get, Post, Render, Response, Query } from '@nestjs/common';

@Controller(`${Config.adminPath}/role`)
export class RoleController {
    constructor(private roleService: RoleService,
        private toolsService: ToolsService,
        private accessService: AccessService,
        private roleAccessService: RoleAccessService) {

    }

    @Get()
    @Render('admin/role/index')
    async index() {
        var result = await this.roleService.find();
        console.log(result);
        return {
            roleList: result
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
    async delete(@Query() query, @Response() res) {
        var result = await this.roleService.delete({ "_id": query.id });
        console.log(result);
        this.toolsService.success(res, `/${Config.adminPath}/role`);
    }

    // 授权
    @Get('auth')
    @Render('admin/role/auth')
    async roleAuth(@Query() query) {
        //1、在access表中找出  module_id=0的数据 
        //2、让access表和access表关联    条件：找出access表中module_id等于_id的数据

        var role_id = query.id;
        var result = await this.accessService.getModel().aggregate([
            {
                $lookup: {
                    from: 'access',
                    localField: '_id',
                    foreignField: 'module_id',
                    as: 'items'
                }
            },
            {
                $match: {
                    "module_id": '0'
                }
            }
        ]);

        console.log(result);
        return {
            list: result,
            role_id: role_id
        };
    }

    @Post('doAuth')
    async doAuth(@Body() body, @Response() res) {
        console.log(body);

        var role_id = body.role_id;

        var access_node = body.access_node;

        //1、删除当前角色下面的所有权限

        await this.roleService.deleteMany({ "role_id": role_id });

        //2、把当前角色对应的所有权限增加到role_access表里面

        for(var i=0;i<access_node.length;i++){

            await this.roleAccessService.add({
                role_id:role_id,
                access_id:access_node[i]
            })
        }        
        this.toolsService.success(res, `/${Config.adminPath}/role/auth?id=${role_id}`);


    }


}
