import { ToolsService } from './../../../service/tools/tools.service';
import { Config } from './../../../config/config';
import { Controller, Get, Render, Body, Post,UseInterceptors,UploadedFile } from '@nestjs/common';
import { FileInterceptor} from '@nestjs/platform-express';

@Controller(`${Config.adminPath}/focus`)
export class FocusController {

    constructor(private toolsService:ToolsService){

    }

    @Get()
    index() {

        return "轮播图页面";
    }

    @Get('add')
    @Render('admin/focus/add')
    addFocus() {
        return {};
    }


    @Post('doAdd')
    @UseInterceptors(FileInterceptor('focus_img'))
    doAdd(@Body() body,@UploadedFile() file){

        console.log(body); 
        console.log(file);      

        let saveDir=this.toolsService.uploadFile(file);
        console.log(saveDir);  
   
        return saveDir;
        
    }
}
