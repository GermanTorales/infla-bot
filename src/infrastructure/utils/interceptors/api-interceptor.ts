import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";

import { ApiResponse } from "src/application/presentations";

@Injectable()
export class NormalizeResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        let content;

        if (Array.isArray(data)) content = { list: data, count: data.length };
        else content = { data };

        return {
          message: "Api request [SUCCESS]",
          data: content,
          status: context.switchToHttp().getResponse().statusCode,
        };
      }),
    );
  }
}
