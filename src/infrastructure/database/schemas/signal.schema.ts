import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractSchema } from '../abstract.schema';

@Schema()
class XRay {
  @Prop({ type: Number })
  time: number;
  @Prop({ type: Number })
  speed: number;
  @Prop({ type: Number })
  x: number;
  @Prop({ type: Number })
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
