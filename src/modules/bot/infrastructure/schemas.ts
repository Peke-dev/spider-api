import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Chat, ChatSubscriptions } from '../domain';

export const CHAT_COLLECTION = 'chats';

@Schema({ _id: false })
export class ChatSubscriptionsSchema {
  @Prop({ type: [String], required: true })
  leagues: string[];

  @Prop({ type: [String], required: true })
  matches: string[];
}

@Schema({
  timestamps: false,
  collection: CHAT_COLLECTION,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class SChat {
  @Prop({ type: Number, required: true, index: true, unique: true })
  id: number;

  @Prop({ type: String, required: true })
  timezone: string;

  @Prop({ type: String, required: true })
  language: string;

  @Prop({ type: ChatSubscriptionsSchema, required: true })
  subscriptions: ChatSubscriptions;
}

export const ChatSchema = SchemaFactory.createForClass(SChat);
export type ChatDocument = Document<Chat>;

// @Schema({ _id: false })
// export class ButtonSchema {
//   @Prop({ type: String, required: true })
//   text: string;

//   @Prop({ type: String, required: true })
//   value: string;
// }

// @Schema({ _id: false })
// export class SessionDataSchema {
//   @Prop({ type: [String], required: true })
//   leaguesSelected: string[];

//   @Prop({ type: [ButtonSchema], required: true })
//   buttons: ButtonSchema[];
// }

// @Schema({
//   collection: 'chats_session',
// })
// export class SChatSession {
//   @Prop({ type: String, required: true })
//   _id: string;

//   @Prop({ type: Object, required: true })
//   data: object;
// }

// export const ChatSessionSchema = SchemaFactory.createForClass(SChatSession);
// export type ChatSessionDocument = Document<ISession>;
