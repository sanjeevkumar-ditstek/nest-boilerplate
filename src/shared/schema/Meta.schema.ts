import { Prop, Schema } from '@nestjs/mongoose';
import * as Time from '../../shared/utils/time.util';

@Schema()
export class Timestamp {
  @Prop({
    type: Object,
    default: {
      createdAt: Time.now(),
      updatedAt: Time.now(),
    },
  })
  meta: {
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    updatedBy: string;
  };
}
