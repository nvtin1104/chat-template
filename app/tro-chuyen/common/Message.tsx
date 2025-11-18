import React from 'react';
import MarkdownMessage from './MarkdownMessage';

const Message = ({ message, sender }: { message: string, sender: string }) => {
    const messageClass = sender === 'user' ? 'chat-message user-message' : 'chat-message assistant-message';
    return (
        <div className={messageClass}>
            <MarkdownMessage content={message} />
        </div>
    );
};

export default Message;