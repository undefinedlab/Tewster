import React, { useState, useEffect } from 'react';
import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';

class Web3AuthSigner {
  constructor(provider) {
    this.provider = provider;
  }

  async getAddress() {
    try {
      const accounts = await this.provider.request({ method: 'eth_accounts' });
      return accounts[0];
    } catch (error) {
      console.error('Error getting address:', error);
      throw error;
    }
  }

  async signMessage(message) {
    try {
      const address = await this.getAddress();
      return await this.provider.request({
        method: "personal_sign",
        params: [message, address]
      });
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }
}

const Chat = ({ provider }) => {
  const [client, setClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const recipient = '0xC8c3107300b2b2355F45DbD3265f02771f328339';

  useEffect(() => {
    const initClient = async () => {
      if (provider) {
        try {
          console.log("Provider:", provider);
          console.log("Provider type:", typeof provider);
          console.log("Provider methods:", Object.keys(provider));
          
          const signer = new Web3AuthSigner(provider);
          console.log("Custom signer created:", signer);
          
          const newClient = await Client.create(signer, { env: 'dev' });
          console.log("XMTP Client created:", newClient);
          setClient(newClient);
          await loadConversationAndHistory(newClient);
        } catch (error) {
          console.error('Error initializing XMTP client:', error);
        }
      }
    };

    initClient();
  }, [provider]);

  const loadConversationAndHistory = async (client) => {
    try {
      const canMessage = await client.canMessage(recipient);
      if (canMessage) {
        const newConversation = await client.conversations.newConversation(recipient);
        setConversation(newConversation);
        const history = await newConversation.messages();
        setMessages(history);
      } else {
        console.log('Recipient is not XMTP enabled');
      }
    } catch (error) {
      console.error('Error loading conversation and history:', error);
    }
  };

  const sendMessage = async () => {
    if (conversation && messageText) {
      try {
        const sentMessage = await conversation.send(messageText);
        setMessages([...messages, sentMessage]);
        setMessageText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    const streamMessages = async () => {
      if (client && conversation) {
        try {
          for await (const message of await client.conversations.streamAllMessages()) {
            setMessages((prevMessages) => [...prevMessages, message]);
          }
        } catch (error) {
          console.error('Error streaming messages:', error);
        }
      }
    };

    streamMessages();
  }, [client, conversation]);

  return (
    <div>
      <h1>Live Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderAddress === client?.address ? 'You' : 'Other'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;