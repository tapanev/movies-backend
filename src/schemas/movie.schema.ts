import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: Number })
  published_year: string;

  @Prop({ required: true, type: String })
  poster: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
