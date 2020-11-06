import { GoodsTypeService } from './../../service/goods-type/goods-type.service';
import { GoodsTypeSchema } from './../../schema/goods_type.schema';
import { FocusService } from './../../service/focus/focus.service';
import { FocusSchema } from './../../schema/focus.schema';
import { RoleAccessService } from './../../service/role-access/role-access.service';
import { RoleAccessSchema } from './../../schema/role_access.schema';
import { AccessService } from './../../service/access/access.service';
import { AccessSchema } from './../../schema/access.schema';
import { RoleService } from './../../service/role/role.service';
import { RoleSchema } from './../../schema/role.schema';
import { AdminService } from './../../service/admin/admin.service';
import { AdminSchema } from './../../schema/admin.schema';

import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Module, NestModule,MiddlewareConsumer } from '@nestjs/common';
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { ManagerController } from './manager/manager.controller';
import { ToolsService } from '../../service/tools/tools.service';
import { RoleController } from './role/role.controller';
import { AccessController } from './access/access.controller';
import { FocusController } from './focus/focus.controller';
import { GoodsTypeController } from './goods-type/goods-type.controller';


@Module({
  imports:[MongooseModule.forFeature([
    {name:'Admin',schema:AdminSchema, collection:'admin' },
    {name:'Role', schema:RoleSchema, collection:'role'},
    {name:'Access', schema:AccessSchema, collection:'access'},
    {name:'RoleAccess', schema:RoleAccessSchema, collection:'role_access'},
    {name:'Focus', schema:FocusSchema,collection:'focus'},
    {name:'GoodsType', schema: GoodsTypeSchema,collection:"goods_type"} 
  ])],
  controllers: [MainController, LoginController, ManagerController, RoleController, AccessController, FocusController, GoodsTypeController],
  providers:[ToolsService, AdminService, RoleService, AccessService, RoleAccessService,FocusService, GoodsTypeService],
  exports:[AdminService,RoleService,AccessService,RoleAccessService]
})
export class AdminModule {}

