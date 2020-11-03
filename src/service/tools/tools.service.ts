import { Injectable } from '@nestjs/common';
// 引入验证码库
import * as svgCaptcha from 'svg-captcha';
//md5加密
import * as md5 from 'md5';

@Injectable()
export class ToolsService {
    // 获取验证码
    getCaptcha() {
        var captcha = svgCaptcha.create({
            size: 1, // 验证码个数
            fontSize: 50,
            width: 100,
            height: 34,
            background: "#cc9966"
        });
        return captcha;
    }

    // 获取md5加密
    getMd5(str:string){
        return md5(str);
    }

    // 成功的跳转
    async success(res,redirectUrl){
        await res.render('admin/public/success',{                          
            redirectUrl:redirectUrl
        })
    }

    // 失败的跳转
    async error(res,message,redirectUrl){
        await res.render('admin/public/error',{
            message:message,
            redirectUrl:redirectUrl
        })
    }
}
