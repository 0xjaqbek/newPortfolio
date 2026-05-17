'use client';

import { useChat } from '@/context/ChatContext';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import styles from './ChatWindow.module.css';

export default function ChatWindow() {
  const { messages, addMessage, clearMessages, isLoading, setIsLoading } = useChat();
  const { settings } = useAppSettings();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    addMessage({ role: 'user', content: userMessage });
    setIsLoading(true);

    try {
      // Determine which API endpoint to use based on AI provider setting
      const endpoint = settings.aiProvider === 'rag-assistant' ? '/api/chat-rag' : '/api/chat';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      addMessage({ role: 'assistant', content: data.message });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        role: 'assistant',
        content: 'ERROR: Unable to process request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.prompt}>$</span> ai-chat.sh
          <span className={styles.provider}>
            [{settings.aiProvider === 'rag-assistant' ? 'RAG' : 'Direct'}]
          </span>
        </h3>
        {messages.length > 0 && (
          <button
            className={styles.clearButton}
            onClick={clearMessages}
            title="Clear chat history"
          >
            [CLEAR]
          </button>
        )}
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.welcome}>
            <p>
              <span className={styles.prompt}>{'>'}</span> AI Assistant Online
            </p>
            <p className={styles.welcomeText}>
              Ask me about Jakub's skills, projects, or discuss potential
              collaborations.
            </p>
            <div className={styles.aiInfo}>
              <p className={styles.aiInfoTitle}>
                <span className={styles.prompt}>{'>'}</span> AI Mode: {settings.aiProvider === 'rag-assistant' ? 'RAG Assistant' : 'DeepSeek Direct'}
              </p>
              <p className={styles.aiInfoText}>
                {settings.aiProvider === 'rag-assistant'
                  ? '📚 Using semantic search across portfolio, documentation, and security logs for context-aware responses'
                  : '⚡ Fast direct API responses'}
              </p>
            </div>
            <p className={styles.welcomeText}>
              You can also browse other sections using the menu [≡].
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className={styles.typingIndicator}>
                <span className={styles.prompt}>{'>'}</span> Processing
                <span className={styles.dots}>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          className={styles.input}
          disabled={isLoading}
          rows={1}
        />
        <button type="submit" disabled={isLoading || !input.trim()} className={styles.sendButton}>
          [SEND]
        </button>
      </form>
    </div>
  );
}
