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
        console.log('role doadd doadd');
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

        //1、获取全部的权限
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

        //2、查询当前角色拥有的权限（查询当前角色的权限id） 把查找到的数据放在数组中


        var accessResult = await this.roleAccessService.find({ "role_id": role_id });

        var roleAccessArray = [];
        accessResult.forEach(value => {
            roleAccessArray.push(value.access_id.toString());
        });

        console.log(roleAccessArray);

        // 3、循环遍历所有的权限数据，判断当前权限是否在角色权限的数组中,如果是的话给当前数据加入checked属性

        for (var i = 0; i < result.length; i++) {

            if (roleAccessArray.indexOf(result[i]._id.toString()) != -1) {
                result[i].checked = true;
            }


            for (var j = 0; j < result[i].items.length; j++) {

                if (roleAccessArray.indexOf(result[i].items[j]._id.toString()) != -1) {
                    result[i].items[j].checked = true;
                }
            }
        }


        return {
            list: result,
            role_id: role_id
        };


    }

    @Post('doAuth')
    async doAuth(@Body() body,@Response() res) {
       
        console.log(body);

        var role_id=body.role_id;

        var access_node=body.access_node;
         
        //1、删除当前角色下面的所有权限

        await this.roleAccessService.deleteMany({"role_id":role_id});

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
