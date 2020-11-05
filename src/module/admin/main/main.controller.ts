import { FocusService } from './../../../service/focus/focus.service';
import { RoleAccessService } from './../../../service/role-access/role-access.service';
import { AccessService } from './../../../service/access/access.service';
import { Config } from './../../../config/config';
import { Controller, Get, Request, Render, Query } from '@nestjs/common';

@Controller(`${Config.adminPath}/main`)
export class MainController {

    constructor(private accessService: AccessService, private roleAccessService: RoleAccessService, private focusService:FocusService) {

    }

    @Get('welcome')
    @Render('admin/main/welcome')
    welcome() {
        return {};
    }

    @Get()
    @Render('admin/main/index')
    async index(@Request() req) {

        //1、获取全部的权限
        var userinfo = req.session.userinfo;
        var role_id = userinfo.role_id;
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

        console.log("jjjjjjjjjjjjjjj");
        console.log(JSON.stringify(result));

        return {

            asideList: result
        };

    }

    @Get('changeStatus')
    async changeStatus(@Query() query) {

        //1、获取要修改数据的id
        //2、我们需要查询当前数据的状态 
        //3、修改状态   0 修改成 1    1修改成0

        // var model='focusService';

        var id = query.id;
        var model = query.model + "Service";   //要操作的数据模型  也就修改的表 focus
        var fields = query.fields;   //要修改的字段   status

        var json;
        var focusResult = await this[model].find({ "_id": id });

        if (focusResult.length > 0) {
            var tempFields = focusResult[0][fields];

            tempFields == 1 ? json = { [fields]: 0 } : json = { [fields]: 1 };   //es6的属性名表达式

            await this[model].update({ "_id": id }, json);
            return {
                success: true,
                message: '修改状态成功'
            };

        } else {
            return {
                success: false,
                message: '传入参数错误'
            };
        }

    }

}
