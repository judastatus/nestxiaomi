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
            size: 4,
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
}
