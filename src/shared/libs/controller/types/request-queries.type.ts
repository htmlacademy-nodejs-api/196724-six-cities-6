import { Query } from 'express-serve-static-core';

export type RequestQueries <T = Record<string, string>> = T | Query;
