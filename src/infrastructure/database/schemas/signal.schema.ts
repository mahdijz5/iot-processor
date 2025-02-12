import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractSchema } from '../abstract.schema';

class XRay {
  time: number;
  speed: number;
  x: number;
  y: number;
}

@Schema({
  collection: 'signal',
})
export class SignalModel extends AbstractSchema {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  time: number;

  @Prop({ type: Number, required: true })
  dataLength: number;

  @Prop({ type: Number, required: true })
  dataVolume: number;

  @Prop({
    type: [XRay],
  })
  data: Array<XRay>;
}

export const SignalSchema = SchemaFactory.createForClass(SignalModel);
