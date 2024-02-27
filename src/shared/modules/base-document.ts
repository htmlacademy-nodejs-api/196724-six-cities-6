import { defaultClasses } from '@typegoose/typegoose';

export class BaseDocument extends defaultClasses.TimeStamps {
  _id: defaultClasses.Base['_id'];
  id: defaultClasses.Base['id'];
}
