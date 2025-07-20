import { Injectable } from '@nestjs/common';
import { AChat, Chat, ChatProps, ChatRepository } from '../../domain';

@Injectable()
export class CreateChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(chat: ChatProps): Promise<Chat> {
    const newChat = AChat.create(chat);
    return this.chatRepository.create(newChat.getEntity());
  }
}
