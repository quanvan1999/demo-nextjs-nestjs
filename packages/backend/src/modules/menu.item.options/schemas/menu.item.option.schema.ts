import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { getSchemaName } from '../../../utils/types';
export type MenuItemOptionDocument = HydratedDocument<MenuItemOption>;

@Schema({ timestamps: true })
export class MenuItemOption {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: getSchemaName(MenuItem, 'name') })
  menuItem: mongoose.Schema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  additionalPrice: number;

  @Prop()
  optionalDescription: string;
}

export const MenuItemOptionSchema = SchemaFactory.createForClass(MenuItemOption);
