import { FocusService } from './../../../service/focus/focus.service';
import { ToolsService } from './../../../service/tools/tools.service';
import { Config } from './../../../config/config';
import { Controller, Get, Render, Body, Query, Response, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(`${Config.adminPath}/focus`)
export class FocusController {

    constructor(private toolsService: ToolsService, private focusService: FocusService) {

    }

    @Get()    
    @Render('admin/focus/index')    
    async index(){

        let result=await this.focusService.find();
        return {
            focusList:result
        };
    }

    @Get('add')
    @Render('admin/focus/add')
    addFocus() {
        return {};
    }


    @Post('doAdd')
    @UseInterceptors(FileInterceptor('focus_img'))
    async doAdd(@Body() body, @UploadedFile() file, @Response() res) {

        console.log(body);
        console.log(file);

        let saveDir = this.toolsService.uploadFile(file);
        console.log(saveDir);
        await this.focusService.add(Object.assign(body, {
            focus_img: saveDir
        }))

        this.toolsService.success(res, `/${Config.adminPath}/focus`);

    }

    @Get('edit')
    @Render('admin/focus/edit')    
    async edit(@Query() query){
        try {
            let result=await this.focusService.find({"_id":query.id});
           
            return {
                focus:result[0]
            };
        } catch (error) {
            console.log(error)
        }
       
    }

    @Post('doEdit')
    @UseInterceptors(FileInterceptor('focus_img'))
    async doEdit(@Body() body,@UploadedFile() file,@Response() res){
        
        let _id=body._id;

        if(file){
            let saveDir=this.toolsService.uploadFile(file);
            await this.focusService.update({
                "_id":_id
            },Object.assign(body,{
                focus_img:saveDir
            }));
        }else{
            await this.focusService.update({
                "_id":_id
            },body);
        }        
       
        this.toolsService.success(res,`/${Config.adminPath}/focus`);
        
    }

    @Get('delete')  
    async delete(@Query() query,@Response() res) {
        var result = await this.focusService.delete({ "_id": query.id });     
        this.toolsService.success(res, `/${Config.adminPath}/focus`);
    }
}
