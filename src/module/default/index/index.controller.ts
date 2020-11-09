import { Controller, Get,Render } from '@nestjs/common';

@Controller('')
export class IndexController {

    @Get()
    @Render('default/index/index')
    index(){
        return {};
    }
    
}
