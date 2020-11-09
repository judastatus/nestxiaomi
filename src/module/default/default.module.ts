import { CardController } from './card/card.controller';
import { Module } from '@nestjs/common';
import {PublicModule} from '../public/public.module';

import { IndexController } from './index/index.controller';
import { UserController } from './user/user.controller';
import { AddressController } from './address/address.controller';
import { BuyController } from './buy/buy.controller';
import { PassController } from './pass/pass.controller';
import { ProductController } from './product/product.controller';


@Module({
  imports:[
    PublicModule
  ],
  controllers: [IndexController, UserController, AddressController, BuyController, PassController, CardController, ProductController]
})
export class DefaultModule {}
