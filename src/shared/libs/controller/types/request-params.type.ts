import { ParamsDictionary } from 'express-serve-static-core';

export type RequestParams<T = Record<string, string>> = T | ParamsDictionary;
