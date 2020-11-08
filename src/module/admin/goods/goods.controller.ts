import { ToolsService } from './../../../service/tools/tools.service';
import { GoodsService } from './../../../service/goods/goods.service';
import { Config } from './../../../config/config';
import { Controller, Get,Render } from '@nestjs/common';

@Controller(`${Config.adminPath}/goods`)
export class GoodsController {

    constructor(private goodsService:GoodsService, private toolsService:ToolsService) {

    }

    @Get()
    @Render('admin/goods/index')
    index() {

        return {};
    }

    @Get('add')
    @Render('admin/goods/add')
    add(){

        // this.goodsService.add({
        //     title:"小米手机",
        //     sub_title:'市，订金预售中，11.11日0点开始支付'
        // });
        return {}


    }
}
