import { AdminService } from './../../../service/admin/admin.service';
import { ToolsService } from './../../../service/tools/tools.service';
import { RoleService } from './../../../service/role/role.service';
import { Config } from './../../../config/config';
import { Controller,Get, Render,Post, Body,Response, Query } from '@nestjs/common';

@Controller(`${Config.adminPath}/manager`)
export class ManagerController {

    constructor(private adminService: AdminService,private roleService:RoleService, private toolsService:ToolsService){

    }

    @Get()
    @Render('admin/manager/index')
    async index() {

        //获取admin表以及role表关联数据
       var result = await this.adminService.getModel().aggregate([
            { 
                $lookup: { from: "role", localField: "role_id", foreignField: "_id", as: "role" } 
        
            }
        ]);

        // console.log(JSON.stringify(result));

        return {
            adminResult:result
        };
    }

   
    @Get("add")
    @Render('admin/manager/add')
    async addManger() {
        
        var roleResult = await this.roleService.find();
        return {
            roleList: roleResult
        };
    }

    @Post('doAdd')
    async doAdd(@Body() body, @Response() res) {
        console.log(body);
        if (body.username == '' || body.password.length < 6) {
            this.toolsService.error(res, '用户名或者密码长度不合法', `/${Config.adminPath}/manager/add`);
        } else {
            //从数据库查询当前用户名是否存在
            var adminResult = await this.adminService.find({ "username": body.username });

            if (adminResult.length > 0) {
                this.toolsService.error(res, '此管理已经存在', `/${Config.adminPath}/manager/add`);
            } else {
                body.password = this.toolsService.getMd5(body.password);
                this.adminService.add(body);
                this.toolsService.success(res, `/${Config.adminPath}/manager`);
            }

        }


    }

    @Get("edit")
    @Render('admin/manager/edit')
    async editManger(@Query() query) {
        console.log(query);

        var adminResult = await this.adminService.find({_id:query.id});
        console.log(adminResult);
        var roleResult = await this.roleService.find();

        return {
            adminResult:adminResult[0],
            roleList:roleResult
        };
    }

    @Post('doEdit')
    async doEdit(@Body() body, @Response() res) {
        console.log(body);     
        var id=body._id;
        var password=body.password;
        var mobile=body.mobile;
        var email=body.email;
        var role_id=body.role_id;  
        if(password!=''){
           if(password.length<6){
                this.toolsService.error(res, '密码长度不合法', `/${Config.adminPath}/manager/edit?id=${id}`);
                return;

           }else{
                password=this.toolsService.getMd5(password);
                await this.adminService.update({"_id":id},{
                    mobile,
                    email,
                    role_id,
                    password
                });
           }

        } else{
            await this.adminService.update({"_id":id},{
                mobile,
                email,
                role_id
            });

        }
        this.toolsService.success(res, `/${Config.adminPath}/manager`);
    }

    @Get('delete')  
    async delete(@Query() query,@Response() res) {
        var result = await this.adminService.delete({ "_id": query.id });     
        this.toolsService.success(res, `/${Config.adminPath}/manager`);
    }
}
