
import React from 'react';
import { Button } from "@/components/ui/button";

interface Message {
  sender: string;
  text: string;
}

interface ChatTabProps {
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent) => void;
}

const ChatTab = ({ messages, newMessage, setNewMessage, sendMessage }: ChatTabProps) => {
  return (
    <div className="fantasy-card p-4">
      <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Chat da Sessão</h2>
      <div className="h-96 overflow-y-auto mb-4 p-3 bg-fantasy-dark/40 rounded-lg">
        {messages.map((message, index) => (
          <div key={index} className={`p-3 rounded mb-2 ${message.sender === "Mestre" ? 'bg-fantasy-purple/20' : 'bg-fantasy-dark/30'}`}>
            <span className="text-sm font-medium text-fantasy-gold">{message.sender}:</span>
            <p className="text-sm text-white">{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="mt-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-fantasy-dark/50 text-white rounded-l-md py-2 px-3 focus:outline-none"
          />
          <Button type="submit" className="fantasy-button primary rounded-l-none text-sm py-2.5">
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatTab;
