import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { getSchemaName } from '../../../utils/types';

export type MenuDocument = HydratedDocument<Menu>;

@Schema({ timestamps: true })
export class Menu {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: getSchemaName(Restaurant, 'name') })
  restaurant: mongoose.Schema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
