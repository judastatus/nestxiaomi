import { Helper } from './../extend/helper';
import { Config } from './../config/config';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class InitMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    res.locals.config = Config;
    res.locals.helper = Helper;
    next();
  }
}
