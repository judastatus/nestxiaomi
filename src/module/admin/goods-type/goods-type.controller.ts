import { ToolsService } from './../../../service/tools/tools.service';
import { GoodsTypeService } from './../../../service/goods-type/goods-type.service';
import { Config } from './../../../config/config';
import { Controller, Get,Render,Post, Body, Response,Query } from '@nestjs/common';


@Controller(`${Config.adminPath}/goodsType`)
export class GoodsTypeController {

    constructor(private goodsTypeService:GoodsTypeService, private toolsService:ToolsService){

    }

    @Get()    
    @Render('admin/goodsType/index')    
    async index(){
        //获取所有的商品类型
        var result =await this.goodsTypeService.find({});
        return {
            list:result
        };
    }

    @Get('add')    
    @Render('admin/goodsType/add')    
    async add(){

        return {};
    }


    @Post('doAdd')       
    async doAdd(@Body() body,@Response() res){
        await this.goodsTypeService.add(body);
        this.toolsService.success(res,`/${Config.adminPath}/goodsType`);       
    }

    @Get('edit')    
    @Render('admin/goodsType/edit')    
    async edit(@Query() query){      
        var result=await this.goodsTypeService.find({"_id":query.id});
        return {
            list:result[0]
        };
    }

    @Post('doEdit')       
    async doEdit(@Body() body,@Response() res){

        var id=body._id;
        await this.goodsTypeService.update({"_id":id},body);

        this.toolsService.success(res,`/${Config.adminPath}/goodsType`);        
    }

    @Get('delete')  
    async delete(@Query() query,@Response() res) {
        var result = await this.goodsTypeService.delete({ "_id": query.id });     
        this.toolsService.success(res, `/${Config.adminPath}/goodsType`);
    }

}
