import { defaultClasses } from '@typegoose/typegoose';

// ⚠️ Question. Is it fine to declare such a class instead of merging declarations as suggested on out election.
// I found it a bit confusing.
export class BaseDocument extends defaultClasses.TimeStamps {
  _id?: defaultClasses.Base['_id'];
  id?: defaultClasses.Base['id'];
}
