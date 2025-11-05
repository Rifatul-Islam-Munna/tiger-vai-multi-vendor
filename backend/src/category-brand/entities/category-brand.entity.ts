import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;
export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true })
  name: string;

  @Prop()
  logoUrl: string;


  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop()
  isTop:boolean;

}
@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  // ✅ Now an array of subcategories
  @Prop({ type: [String], required: true })
  subCategory: string[];

  @Prop()
  logoUrl: string;
  @Prop()
  isTop:boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
export const CategorySchema = SchemaFactory.createForClass(Category);
