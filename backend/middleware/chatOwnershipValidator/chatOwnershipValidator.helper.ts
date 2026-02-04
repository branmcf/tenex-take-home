import { getChatOwnership } from '../../app/chats/chats.service';
import {
    ChatNotFoundError
    , ChatAccessDeniedError
    , ChatIdRequiredError
} from './chatOwnershipValidator.errors';

/**
 * validate that a chat exists and belongs to the specified user
 *
 * @param chatId - the chat id to validate
 * @param userId - the user id to check ownership against
 * @throws ChatIdRequiredError if chatId is not provided
 * @throws ChatNotFoundError if chat does not exist or is deleted
 * @throws ChatAccessDeniedError if chat does not belong to the user
 */
export const validateChatOwnership = async (
    chatId: string | undefined
    , userId: string
): Promise<void> => {

    // check for falsy chatId
    if ( !chatId ) {
        throw new ChatIdRequiredError();
    }

    // get the chat ownership info from the database
    const getChatOwnershipResult = await getChatOwnership( chatId );

    // check for errors
    if ( getChatOwnershipResult.isError() ) {

        // if chat not found, throw specific error
        if ( getChatOwnershipResult.value.code === 'CHAT_NOT_FOUND' ) {
            throw new ChatNotFoundError();
        }

        // throw the original error for other cases
        throw getChatOwnershipResult.value;
    }

    // extract the chat data
    const chat = getChatOwnershipResult.value;

    // check if chat data exists
    if ( !chat ) {
        throw new ChatNotFoundError();
    }

    // check if chat belongs to the user
    if ( chat.userId !== userId ) {
        throw new ChatAccessDeniedError();
    }

};
