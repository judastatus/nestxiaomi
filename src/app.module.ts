import { Config } from './config/config';
import { InitMiddleware } from './middleware/init.middleware';
import { Module,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { AdminModule } from './module/admin/admin.module';
import { DefaultModule } from './module/default/default.module';
import { ApiModule } from './module/api/api.module';
import { MongooseModule} from '@nestjs/mongoose'
//配置中间件
import {AdminauthMiddleware} from './middleware/adminauth.middleware'


@Module({
  imports: [AdminModule, DefaultModule, ApiModule,
  MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestxiaomi', {useNewUrlParser:true})
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminauthMiddleware)
      .forRoutes(`${Config.adminPath}/*`).apply(InitMiddleware).forRoutes('*');
  }
}