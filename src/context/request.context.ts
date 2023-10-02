import { Request } from 'express';

export class RequestContext {
  requestTraceId: string;
  constructor(private readonly request: Request) {}
}
