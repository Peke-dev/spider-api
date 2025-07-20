import { Model } from 'mongoose';

import { Chat, ChatRepository } from '../../domain';
import { ChatDocument } from '../schemas';

export class MongooseChatRepository implements ChatRepository {
  constructor(private readonly chatModel: Model<ChatDocument>) {}

  async create(data: Chat): Promise<Chat> {
    const chat = await this.chatModel.create(data);
    return this.toDomain(chat);
  }

  async findOneById(id: number): Promise<Chat | null> {
    const chat = await this.chatModel.findOne({ id });
    return chat ? this.toDomain(chat) : null;
  }

  async update(chat: Chat): Promise<Chat> {
    const updatedChat = await this.chatModel.findOneAndUpdate(
      { id: chat.id },
      chat,
      { new: true },
    );

    if (!updatedChat) throw new Error('Invalid chat id');

    return this.toDomain(updatedChat);
  }

  toDomain(chat: ChatDocument): Chat {
    const data = chat.toJSON();
    return new Chat(data as Chat);
  }
}
