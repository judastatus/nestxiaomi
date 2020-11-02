import { AdminService } from './../../../service/admin/admin.service';
import { ToolsService } from './../../../service/tools/tools.service';
import { Body, Controller,Get, Post, Render,Request,Response } from '@nestjs/common';

@Controller('admin/login')
export class LoginController {

    constructor(private toolsService :ToolsService, private adminService: AdminService){}

    @Get()
    @Render('admin/login')
    async index() {
        return {};
    }

    @Get('code')
    code(@Request() req, @Response() res) {
        var svgCaptcha = this.toolsService.getCaptcha();
        // 设置session
        req.session.code = svgCaptcha.text;
        res.type('image/svg+xml');
        res.send(svgCaptcha.data);
    }

    @Post('doLogin')
    async doLogin(@Body() body, @Request() req,@Response() res) {
        try {
            console.log(body);
        
            var code: string = body.code;
           
            var username: string = body.username;
            var password: string = body.password;
            if (username == "" || password.length < 6) {
                console.log('用户名 或者密码不合法');
                res.redirect('/admin/main');   
            } else {

                if (code.toLowerCase() == req.session.code.toLowerCase()) {
                    password = this.toolsService.getMd5(password);
                    var userResult = await this.adminService.find({ "username": username, "password": password });
                    if (userResult.length > 0) {
                        console.log('登录成功');
                        req.session.userinfo=userResult[0];
                        res.redirect('/admin/main');
                    } else {
                        console.log('用户名或者密码不正确');
                        res.redirect('/admin/login');
                    }
                } else {
                    console.log('验证码不正确');
                    res.redirect('/admin/login');

                }
            }
        } catch (error) {
            console.log(error);   
            res.redirect('/admin/login');
        }
    }
}
