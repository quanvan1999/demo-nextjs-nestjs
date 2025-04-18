import { applyDecorators, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiResponseOptions } from '@nestjs/swagger';

const [GetAPI, PostAPI, PutAPI, PatchAPI, DeleteAPI] = [Get, Post, Put, Patch, Delete].map(
  method => (path: string, options?: ApiResponseOptions) => {
    return applyDecorators(method(path), ApiOkResponse(options));
  },
);

export { GetAPI, PostAPI, PutAPI, PatchAPI, DeleteAPI };
