import { GoodsTypeService } from './../../../service/goods-type/goods-type.service';
import { GoodsColorService } from './../../../service/goods-color/goods-color.service';
import { GoodsCateService } from './../../../service/goods-cate/goods-cate.service';
import { ToolsService } from './../../../service/tools/tools.service';
import { GoodsService } from './../../../service/goods/goods.service';
import { Config } from './../../../config/config';

import { FileInterceptor} from '@nestjs/platform-express';

import { Controller, Get,Render,Post, UseInterceptors, UploadedFile } from '@nestjs/common';

@Controller(`${Config.adminPath}/goods`)
export class GoodsController {

    constructor(private goodsService:GoodsService, 
                private toolsService:ToolsService,
                private goodsCateService:GoodsCateService,
                private goodsColorService: GoodsColorService,
                private goodsTypeService: GoodsTypeService) {

    }

    @Get()
    @Render('admin/goods/index')
    index() {

        return {};
    }

    @Get('add')
    @Render('admin/goods/add')
    async add(){

        //1、获取商品分类
        let goodsCateResult = await this.goodsCateService.getModel().aggregate([
            {
                $lookup: {
                    from: 'goods_cate',
                    localField: '_id',
                    foreignField: 'pid',
                    as: 'items'
                }
            },
            {
                $match: {
                    "pid": '0'
                }
            }
        ]);

        //2、获取所有颜色

        let goodsColorResult=await this.goodsColorService.find({});
        
        //3、获取商品类型

        let goodsTypeResult=await this.goodsTypeService.find({});

        return {
            goodsCate:goodsCateResult,
            goodsColor:goodsColorResult,
            goodsType:goodsTypeResult
        }


    }

    @Post("doUpload")
    @UseInterceptors(FileInterceptor('file'))
    async doUpload(@UploadedFile() file){
        let {saveDir}=this.toolsService.uploadFile(file);      
        return {link: '/'+saveDir};
    }
}
