import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Scopes } from '../../domain/enums';
import { TOKEN_COLLECTION_NAME } from '../../constants';

export type TokenDocument = TokenSchema & Document;

@Schema({ timestamps: true, collection: TOKEN_COLLECTION_NAME })
export class TokenSchema {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  accountName: string;

  @Prop({ default: true })
  isValid: boolean;

  @Prop({ required: true, type: [String], enum: Object.values(Scopes) })
  scopes: Scopes[];

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const TokenSchemaFactory = SchemaFactory.createForClass(TokenSchema);
