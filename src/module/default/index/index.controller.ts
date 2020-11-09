import { GoodsCateService } from './../../../service/goods-cate/goods-cate.service';
import { Controller,Get,Render} from '@nestjs/common';

import {NavService} from '../../../service/nav/nav.service';


import {FocusService} from '../../../service/focus/focus.service';

@Controller('')
export class IndexController {
    constructor(
        private navService:NavService,
        private focusService:FocusService,
        private goodsCateService: GoodsCateService
    ){}

    @Get()
    @Render('default/index/index')
    async index(){

        //顶部导航
        let topNavResult=await this.navService.find({
            position:1,
            status:1
        });
     
        //轮播图
        let focusResult=await this.focusService.find({},{
            "sort":-1
        });
        
        //商品分类
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
                    "pid": '0',
                    "status":1
                }
            }
        ]);
        
       
        return {
            topNav:topNavResult,
            focus:focusResult,
            goodsCate:goodsCateResult
        };
    }

  
}
