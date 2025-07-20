import { Chat } from './entities';

export abstract class ChatRepository {
  abstract findOneById(id: number): Promise<Chat | null>;
  abstract create(data: Chat): Promise<Chat>;
  abstract toDomain(data: unknown): Chat;
  abstract update(chat: Chat): Promise<Chat>;
}
