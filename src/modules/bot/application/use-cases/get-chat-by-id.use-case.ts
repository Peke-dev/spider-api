import { Injectable } from '@nestjs/common';
import { Chat, ChatRepository } from '../../domain';

@Injectable()
export class GetChatByIdUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(id: number): Promise<Chat | null> {
    return this.chatRepository.findOneById(id);
  }
}
