import { Injectable } from '@nestjs/common';
import { Chat, ChatProps, ChatRepository, AChat } from '../../domain';

interface UpdateChatProps extends Omit<ChatProps, 'id'> {
  subscriptions?: {
    leagues: string[];
    matches: string[];
  };
}

@Injectable()
export class UpdateChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {
    console.log(UpdateChatUseCase.name);
  }

  async execute(id: number, newData: UpdateChatProps): Promise<Chat> {
    const chat = await this.chatRepository.findOneById(id);

    if (!chat) throw new Error('Chat not found');

    const chatUpdated = {
      ...chat,
      ...newData,
      subscriptions: {
        leagues: [
          ...new Set([...(newData.subscriptions?.leagues || [])]).values(),
        ],
        matches: [
          ...new Set([
            ...chat.subscriptions.matches,
            ...(newData.subscriptions?.matches || []),
          ]).values(),
        ],
      },
      id: chat.id,
    };

    const newChat = AChat.create(chatUpdated);

    console.log(newChat.getEntity());

    return this.chatRepository.update(newChat.getEntity());
  }
}
