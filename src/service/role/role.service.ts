import { RoleInterface } from './../../interface/role.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleService {
    constructor(@InjectModel('Role') private roleModel) { }

    // 查询
    async find(json:RoleInterface={},fields?:string) {

        try {
            return await this.roleModel.find(json,fields);
        } catch (error) {
            return [];
        } 

    }

    // 添加
    async add(json:RoleInterface){
        try {
            var role=new this.roleModel(json);
            var result=await role.save();
            return result;
        } catch (error) {
            return null;
        }
    }

    // 更新
    async update(json1:RoleInterface,json2:RoleInterface){
        try {
            var result=await this.roleModel.updateOne(json1,json2);          
            return result;
        } catch (error) {
            return null;
        }
    }

    // 删除
    async delete(json:RoleInterface){
        try {
            var result=await this.roleModel.deleteOne(json);          
            return result;
        } catch (error) {
            return null;
        }
    }

    // 删除多个
    async deleteMany(json){
        try {
            var result=await this.roleModel.deleteMany(json);          
            return result;
        } catch (error) {
            return null;
        }
    }

}
