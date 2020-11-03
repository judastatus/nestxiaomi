import { AdminModule } from './../../module/admin/admin.module';
import { Injectable } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import { findSourceMap } from 'module';
import { async } from 'rxjs';

@Injectable()
export class AdminService {
    constructor(@InjectModel('Admin') private readonly adminModel){
       
    }

    async find(json={}){
        return await this.adminModel.find(json);
    } 
}
