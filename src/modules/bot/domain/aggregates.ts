import { ChatProps, Chat } from './entities';
import { ChatSubscriptions, SubscriptionType } from './interfaces';

export class AChat {
  private readonly chat: Chat;
  private readonly initialChat: Chat;

  constructor(chat: Chat) {
    this.initialChat = chat;
    this.chat = chat;
  }

  static create(props: ChatProps) {
    const chat = new Chat(props);
    return new AChat(chat);
  }

  addSubscription(type: SubscriptionType, value: string): Chat {
    const subscriptions = this.chat.subscriptions[type];

    if (subscriptions.includes(value)) {
      return this.chat;
    }

    subscriptions.push(value);

    return this.updateSubscriptions(this.chat.subscriptions);
  }

  removeSubscription(type: SubscriptionType, value: string): Chat {
    const subscriptions = this.chat.subscriptions[type];

    subscriptions.splice(subscriptions.indexOf(value), 1);

    return this.updateSubscriptions(this.chat.subscriptions);
  }

  updateSubscriptions(subscriptions: ChatSubscriptions): Chat {
    this.chat.subscriptions = subscriptions;
    return this.chat;
  }

  getInitialChat(): Chat {
    return this.initialChat;
  }

  getEntity(): Chat {
    return this.chat;
  }
}
