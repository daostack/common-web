import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { processStreamMentions } from '../ChatComponent';
import { getStreamMentionedSystemMessageText } from '../utils/getTextFromSystemMessage';

describe('Stream Mention System', () => {
  describe('processStreamMentions', () => {
    it('should detect and process single stream mention', async () => {
      const message = {
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [{
            type: 'text',
            text: 'Check out this stream: [stream]123|Test Stream[/stream]'
          }]
        }]
      };
      const mockDispatch = jest.fn();
      
      await processStreamMentions(
        message,
        'sourceStreamId',
        'Source Stream',
        'userId',
        mockDispatch
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          systemMessageType: 'STREAM_MENTIONED',
          systemMessageData: {
            userId: 'userId',
            sourceStreamId: 'sourceStreamId',
            sourceStreamName: 'Source Stream'
          }
        })
      );
    });

    it('should handle multiple mentions of the same stream', async () => {
      const message = {
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [{
            type: 'text',
            text: '[stream]123|Test Stream[/stream] and again [stream]123|Test Stream[/stream]'
          }]
        }]
      };
      const mockDispatch = jest.fn();
      
      await processStreamMentions(
        message,
        'sourceStreamId',
        'Source Stream',
        'userId',
        mockDispatch
      );

      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid stream mention format', async () => {
      const message = {
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [{
            type: 'text',
            text: '[stream]invalid-format[/stream]'
          }]
        }]
      };
      const mockDispatch = jest.fn();
      const consoleSpy = jest.spyOn(console, 'error');
      
      await processStreamMentions(
        message,
        'sourceStreamId',
        'Source Stream',
        'userId',
        mockDispatch
      );

      expect(consoleSpy).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('getStreamMentionedSystemMessageText', () => {
    it('should render system message with links', async () => {
      const systemMessageData = {
        userId: 'user123',
        sourceStreamId: 'stream123',
        sourceStreamName: 'Source Stream'
      };
      
      const data = {
        users: {
          user123: {
            id: 'user123',
            name: 'Test User'
          }
        },
        getCommonPagePath: (id: string) => `/streams/${id}`
      };

      const result = await getStreamMentionedSystemMessageText(
        systemMessageData,
        data
      );

      expect(result).toContain('Source Stream');
      expect(result).toContain('Test User');
    });

    it('should handle missing user or stream data', async () => {
      const systemMessageData = {
        userId: 'nonexistent',
        sourceStreamId: 'nonexistent',
        sourceStreamName: 'Source Stream'
      };
      
      const data = {
        users: {},
        getCommonPagePath: (id: string) => `/streams/${id}`
      };

      const result = await getStreamMentionedSystemMessageText(
        systemMessageData,
        data
      );

      expect(result).toEqual(['This stream was mentioned in another stream']);
    });
  });

  describe('Integration', () => {
    it('should create clickable links in rendered message', async () => {
      const systemMessage = {
        systemMessageType: 'STREAM_MENTIONED',
        systemMessageData: {
          userId: 'user123',
          sourceStreamId: 'stream123',
          sourceStreamName: 'Source Stream'
        }
      };

      const { container } = render(
        // Your message rendering component
        <ChatMessage message={systemMessage} />
      );

      await waitFor(() => {
        const links = container.querySelectorAll('a');
        expect(links).toHaveLength(2); // One for stream, one for user
        expect(links[0].getAttribute('href')).toBe('/streams/stream123');
      });
    });
  });
}); 