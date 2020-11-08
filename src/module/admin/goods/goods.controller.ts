import { GoodsImageService } from './../../../service/goods-image/goods-image.service';
import { GoodsAttrService } from './../../../service/goods-attr/goods-attr.service';
import { GoodsTypeAttributeService } from './../../../service/goods-type-attribute/goods-type-attribute.service';
import { GoodsTypeService } from './../../../service/goods-type/goods-type.service';
import { GoodsColorService } from './../../../service/goods-color/goods-color.service';
import { GoodsCateService } from './../../../service/goods-cate/goods-cate.service';
import { ToolsService } from './../../../service/tools/tools.service';
import { GoodsService } from './../../../service/goods/goods.service';
import { Config } from './../../../config/config';

import { FileInterceptor } from '@nestjs/platform-express';

import { Controller, Get, Render, Post, Body, Query, Response, UseInterceptors, UploadedFile } from '@nestjs/common';

@Controller(`${Config.adminPath}/goods`)
export class GoodsController {

    constructor(private goodsService: GoodsService,
        private toolsService: ToolsService,
        private goodsCateService: GoodsCateService,
        private goodsColorService: GoodsColorService,
        private goodsTypeService: GoodsTypeService,
        private goodsTypeAttributeService: GoodsTypeAttributeService,
        private goodsImageService: GoodsImageService,
        private goodsAttrService: GoodsAttrService) {

    }

    @Get()
    @Render('admin/goods/index')
    @Render('admin/goods/index')
    async index() {

       //分页   搜索商品数据

       var goodsResult=await this.goodsService.find();      
       return {
           goodsList:goodsResult
       }
    }

    @Get('add')
    @Render('admin/goods/add')
    async add() {

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

        let goodsColorResult = await this.goodsColorService.find({});

        //3、获取商品类型

        let goodsTypeResult = await this.goodsTypeService.find({});

        return {
            goodsCate: goodsCateResult,
            goodsColor: goodsColorResult,
            goodsType: goodsTypeResult
        }


    }

    //富文本编辑器上传图片  图库上传图片
    @Post("doImageUpload")
    @UseInterceptors(FileInterceptor('file'))
    async doUpload(@UploadedFile() file) {
        let { saveDir, uploadDir } = this.toolsService.uploadFile(file);

        console.log(uploadDir);
        //缩略图
        if (uploadDir) {
            this.toolsService.jimpImg(uploadDir);
        }
        return { link: '/' + saveDir };
    }

    //获取商品类型属性

    @Get('getGoodsTypeAttribute')
    async getGoodsTypeAttribute(@Query() query) {

        let cate_id = query.cate_id;

        let goodsTypeReulst = await this.goodsTypeAttributeService.find({ "cate_id": cate_id })

        return {
            result: goodsTypeReulst
        }
    }

    //执行增加
    @Post("doAdd")
    @UseInterceptors(FileInterceptor('goods_img'))
    async doAdd(@Body() body, @UploadedFile() file, @Response() res) {

        let {saveDir}=this.toolsService.uploadFile(file);  
        //1、增加商品数据
        if(body.goods_color && typeof(body.goods_color)!=='string'){
            body.goods_color=body.goods_color.join(',');
        }        
        var result= await this.goodsService.add(Object.assign(body,{
            goods_img:saveDir
        }));        

        //2、增加图库
        let goods_image_list = body.goods_image_list;
        if(result._id && goods_image_list && typeof(goods_image_list)!=='string'){
            for(var i=0;i<goods_image_list.length;i++){
                await this.goodsImageService.add({
                    goods_id:result._id,
                    img_url:goods_image_list[i]
                })
            }
        }


        //3、增加商品属性

        let attr_id_list = body.attr_id_list;
        let attr_value_list = body.attr_value_list;
        if (result._id && attr_id_list && typeof (attr_id_list) !== 'string') {

            for (var i = 0; i < attr_id_list.length; i++) {
                //获取当前 商品类型id对应的商品类型属性
                let goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({ _id: attr_id_list[i] });
                await this.goodsAttrService.add({
                    goods_id: result._id,
                    //可能会用到的字段  开始
                    goods_cate_id: result.goods_cate_id,
                    attribute_id: attr_id_list[i],
                    attribute_type: goodsTypeAttributeResult[0].attr_type,
                    //可能会用到的字段  结束
                    attribute_title: goodsTypeAttributeResult[0].title,
                    attribute_value: attr_value_list[i],
                })
            }

        }
        this.toolsService.success(res, `/${Config.adminPath}/goods`);

        /*
          {
            title: '1',
            sub_title: '2',
            goods_version: '3',
            cate_id: '5bbf058f9079450a903cb77b',
            shop_price: '4',
            market_price: '5',
            status: '1',
            is_best: '1',
            is_hot: '1',
            content: '<p>66666666666</p>',
            goods_color:
            [ '5bbb68c1fe498e2346af9e48',
                '5bbb68cefe498e2346af9e49',
                '5bbb68dcfe498e2346af9e4a' ],
            relation_goods: '7',
            goods_gift: '8',
            goods_fitting: '9',
            goods_attr: '10',
            goods_type_id: '5bbd7e59e723b71e5815b7db',
            attr_id_list:
            [ '5bbdeba8d41e0711346a1e64',
                '5bbdec2a06b5261ce0a59ad6',
                '5bbdec5106b5261ce0a59ad7' ],
            attr_value_list: [ 'xxxl', '白色', '2018款' ],
            goods_image_list:
            [ '/upload\\20191112\\1573526662018.png',
                '/upload\\20191112\\1573526662030.png' ] }
          
  */

    }

    @Get('edit')
    @Render('admin/goods/edit')
    async edit(@Query() query) {

        /*
        1、获取商品数据

        2、获取商品分类

        3、获取所有颜色 以及选中的颜色

        4、商品的图库信息

        5、获取商品类型

        6、获取规格信息
        */

        //1、获取商品数据
        var goodsResult=await this.goodsService.find({"_id":query.id});

        console.log(goodsResult);

        //2、获取商品分类
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

        //3、获取所有颜色  以及选中的颜色
        let goodsColorResult = await this.goodsColorService.find({});          
        //goodsColorResult是不可改变对象   
        //不可改变对象：我们可以通过序列化和反序列化来改变它里面的属性 
        goodsColorResult=JSON.parse(JSON.stringify(goodsColorResult));

        if(goodsResult[0].goods_color){
            var tempColorArr=goodsResult[0].goods_color.split(',');           
            for(var i=0;i<goodsColorResult.length;i++){
                if(tempColorArr.indexOf(goodsColorResult[i]._id.toString())!=-1){
                    goodsColorResult[i].checked=true;
                }
            }
        }

        console.log(goodsColorResult);



        //4、商品的图库信息

        let goodsImageResult = await this.goodsImageService.find({ goods_id: goodsResult[0]._id });


        //5、获取商品类型
        let goodsTypeResult = await this.goodsTypeService.find({});


        //6、获取规格信息  商品类型属性

        let goodsAttrResult = await this.goodsAttrService.find({ goods_id: goodsResult[0]._id });

     
        let goodsAttrStr = '';

        goodsAttrResult.forEach(async val => {

            if (val.attribute_type == 1) {

                goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
            } else if (val.attribute_type == 2) {
                goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
            } else {
                // 获取 attr_value  获取可选值列表
                const oneGoodsTypeAttributeResult = await this.goodsTypeAttributeService.find({
                    _id: val.attribute_id,
                });

              

                const arr = oneGoodsTypeAttributeResult[0].attr_value.split('\n');

                goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;

                goodsAttrStr += '<select name="attr_value_list">';

                for (let j = 0; j < arr.length; j++) {

                    if (arr[j] == val.attribute_value) {
                        goodsAttrStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
                    } else {
                        goodsAttrStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
                    }
                   
                }
                goodsAttrStr += '</select>';
                goodsAttrStr += '</li>';
            }

        });




        return {
            goodsCate: goodsCateResult,
            goodsColor: goodsColorResult,
            goodsType: goodsTypeResult,
            goods: goodsResult[0],
            goodsAttr: goodsAttrStr,
            goodsImage: goodsImageResult       
        }
    }


    
}
