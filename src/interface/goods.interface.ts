export interface GoodsInterface {
    _id?:String;
    title?:String,
    sub_title?:String,
    goods_sn?:String,
    cate_id?:String,      
    click_count?:Number,     
    goods_number?:Number,
    shop_price?:Number,
    market_price?:Number,
    relation_goods?:String,
    goods_attrs?:String,
    goods_version?:String,
    goods_img?:String,
    goods_gift?:String,
    goods_fitting?:String,
    goods_color?:String,
    goods_keywords?:String,
    goods_desc?:String,
    goods_content?:String,
    sort?:Number,
    is_delete?:Number,
    is_hot?:Number,
    is_best?:Number,
    is_new?:Number,
    goods_type_id?:Number,
    status?: Number,
    add_time?: Number
  }