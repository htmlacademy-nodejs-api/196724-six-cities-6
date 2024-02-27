import { extension, types } from 'mime-types';
import * as crypto from 'node:crypto';
import { IMiddleware} from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { HttpError } from '../exeption-filter/index.js';
import { StatusCodes } from 'http-status-codes';

export class UploadFileMiddleware implements IMiddleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) {}

  private readonly allowedFormats: string[] = [types['jpg'], types['png']];

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileFormat: string = file.mimetype;

        if(!this.allowedFormats.includes(fileFormat)) {
          return next(new HttpError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, `${fileFormat} format is not supported.`, 'UploadFileMiddleware'));
        }

        const fileExtension = extension(file.mimetype);
        const filename: string = crypto.randomUUID();
        callback(null, `${filename}.${fileExtension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({ storage })
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);

  }
}
