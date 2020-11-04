import { Injectable } from '@nestjs/common';
// 引入验证码库
import * as svgCaptcha from 'svg-captcha';
//md5加密
import * as md5 from 'md5';
//格式化日期
import { format } from 'silly-datetime';

import { join, extname } from 'path';

import { Config } from '../../config/config';

//创建目录
import * as mkdirp from 'mkdirp';

import { createWriteStream } from 'fs';

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
    getMd5(str: string) {
        return md5(str);
    }

    // 成功的跳转
    async success(res, redirectUrl) {
        await res.render('admin/public/success', {
            redirectUrl: redirectUrl
        })
    }

    // 失败的跳转
    async error(res, message, redirectUrl) {
        await res.render('admin/public/error', {
            message: message,
            redirectUrl: redirectUrl
        })
    }

    // 获取时间戳
    getTime() {
        let d = new Date();
        return d.getTime();
    }

    // 上传图片
    uploadFile(file) {

        /*
          1、获取当前日期   20191013
          2、根据日期创建目录
          3、实现上传
          4、返回图片保存的地址
          
        */

        // 1、获取当前日期   20191013
        let day = format(new Date(), 'YYYYMMDD');  //目录名称
        let d = this.getTime();  //时间戳  当前图片的名称

        // 2、根据日期创建目录

        let dir = join(__dirname, `../../../public/${Config.uploadDir}`, day);
        mkdirp.sync(dir);
        let uploadDir = join(dir, d + extname(file.originalname));

        // 3、实现上传

        const writeImage = createWriteStream(uploadDir);
        writeImage.write(file.buffer);

        // 4、返回图片保存的地址

        let saveDir = join(Config.uploadDir, day, d + extname(file.originalname));

        return saveDir;

    }
}
