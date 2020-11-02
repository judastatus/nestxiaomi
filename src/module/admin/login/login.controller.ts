import { ToolsService } from './../../../service/tools/tools.service';
import { Controller,Get, Render,Request,Response } from '@nestjs/common';

@Controller('admin/login')
export class LoginController {

    constructor(private toolsService :ToolsService){}

    @Get()
    @Render('admin/login')
    index() {
        return {};
    }

    @Get('code')
    code(@Request() req, @Response() res) {
        var svgCaptcha = this.toolsService.getCaptcha();
        // 设置session
        req.session.captcha = svgCaptcha.text;
        res.type('image/svg+xml');
        res.send(svgCaptcha.data);
    }
}
