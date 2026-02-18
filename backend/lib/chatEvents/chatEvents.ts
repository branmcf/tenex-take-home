import { EventEmitter } from 'events';

/**
 * Event emitter for chat-related events.
 * Used to notify SSE streams when chat data changes.
 */
class ChatEventEmitter extends EventEmitter {
    /**
     * Emit a title updated event for a specific chat
     * @param chatId - The chat ID that was updated
     * @param title - The new title
     */
    emitTitleUpdated( chatId: string, title: string ): void {
        this.emit( `title:${ chatId }`, { chatId, title } );
    }

    /**
     * Subscribe to title updates for a specific chat
     * @param chatId - The chat ID to listen for
     * @param callback - Called when title is updated
     * @returns Unsubscribe function
     */
    onTitleUpdated( chatId: string, callback: ( data: { chatId: string; title: string } ) => void ): () => void {
        const eventName = `title:${ chatId }`;
        this.on( eventName, callback );

        return () => {
            this.off( eventName, callback );
        };
    }
}

// Export a singleton instance
export const chatEvents = new ChatEventEmitter();
