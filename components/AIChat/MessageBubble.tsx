'use client';

import { Message } from '@/context/ChatContext';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.header}>
        <span className={styles.role}>
          {isUser ? '[USER]' : '[AI]'}
        </span>
        <span className={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <div className={styles.content}>
        <span className={styles.prompt}>{'>'}</span>
        <span className={styles.text}>{message.content}</span>
      </div>
    </div>
  );
}
