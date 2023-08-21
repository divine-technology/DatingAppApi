import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestContext } from './request.context';
import { UserContext } from './user.context';

@Injectable()
export class ContextService {
  constructor(@Inject(REQUEST) private request) {
    if (this.request.context) {
      this.request.context = {};
    }
    this.request.context = new RequestContext(this.request);
  }
  get requestContext(): RequestContext {
    return this.request.context.requestContext;
  }

  get userContext(): UserContext {
    return this.request.context.userContext;
  }

  set userContext(userContext: UserContext) {
    this.request.context.userContext = userContext;
  }
}
