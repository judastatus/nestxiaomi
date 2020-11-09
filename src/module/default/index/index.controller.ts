import { Controller,Get,Render} from '@nestjs/common';

import {NavService} from '../../../service/nav/nav.service';


import {FocusService} from '../../../service/focus/focus.service';

@Controller('')
export class IndexController {
    constructor(
        private navService:NavService,
        private focusService:FocusService
    ){}

    @Get()
    @Render('default/index/index')
    async index(){

        var navResult=await this.navService.find({});
        console.log(navResult);

        
        var focusResult=await this.focusService.find({});
        console.log(focusResult);
       
        return {};
    }

  
}
