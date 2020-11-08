import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {GoodsImageInterface} from '../../interface/goods_image.interface'

@Injectable()
export class GoodsImageService {

    constructor(@InjectModel('GoodsImage') private readonly goodsImageModel) {

    }
    
    async find(json:GoodsImageInterface={},fields?:string){
        try {
            return await this.goodsImageModel.find(json,fields);
        } catch (error) {
            return [];
        }       
    }

    async add(json:GoodsImageInterface){
        try {
            var access=new this.goodsImageModel(json);
            var result=await access.save();
            return result;
        } catch (error) {
            return null;
        }
    }

    async update(json1:GoodsImageInterface,json2:GoodsImageInterface){
        try {
            var result=await this.goodsImageModel.updateOne(json1,json2);          
            return result;
        } catch (error) {
            return null;
        }
    }

    async delete(json:GoodsImageInterface){
        try {
            var result=await this.goodsImageModel.deleteOne(json);          
            return result;
        } catch (error) {
            return null;
        }
    }

    getModel(){
       return this.goodsImageModel;
    }
}