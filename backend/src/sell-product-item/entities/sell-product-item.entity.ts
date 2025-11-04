import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { globalSells } from 'lib/global-db/globaldb';
import { UserRole } from 'src/user/entities/user.schema';

export type SellDocument = HydratedDocument<Sell>;

export enum PaymentMethod {
  COD = 'COD',
  ONLINE = 'ONLINE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Schema({ _id: false })
class SellProductItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Product' })
  productId: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop()
  brandName: string;

  @Prop()
  brandId: string;

  @Prop()
  mainCategory: string;

  @Prop()
  category: string;

  @Prop()
  vendorId: string;

  @Prop()
  vendorSlug: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  shortSellRef: MongooseSchema.Types.ObjectId;
}

@Schema({ _id: false })
class ShipmentDetails {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  house: string;

  @Prop({ required: true, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Prop()
  comment: string;
}

@Schema({ timestamps: true })
export class Sell {
  @Prop({ type: [SellProductItem], required: true })
  products: SellProductItem[];

  @Prop({ type: ShipmentDetails, required: true })
  shipment: ShipmentDetails;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userId: string;

  @Prop({ required: true })
  isAdmin: boolean;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;
}

export const SellSchema = SchemaFactory.createForClass(Sell);

