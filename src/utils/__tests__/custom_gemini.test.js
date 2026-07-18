// src/utils/__tests__/custom_gemini.test.js
import { describe, it, expect, vi } from 'vitest';
import { simulateGemini, callLiveGemini } from '../custom_gemini';

const mockSuccessResponse = () => ({
  ok: true,
  status: 200,
  json: async () => ({
    candidates: [
      {
        content: {
          parts: [{ text: JSON.stringify({ reply: 'Hello from mock Gemini' }) }]
        }
      }
    ]
  })
});

describe('custom_gemini', () => {
  describe('simulateGemini', () => {
    vi.setConfig({ testTimeout: 10000 });

    it('should return structured JSON for fifa_historian type', async () => {
      const result = await simulateGemini('fifa_historian', {
        year: 1970,
        winner: 'Brazil',
        host: 'Mexico',
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('era_tactics_title');
      expect(result).toHaveProperty('tactical_breakdown');
      expect(result).toHaveProperty('historical_significance');
      expect(typeof result.tactical_breakdown).toBe('string');
      expect(result.tactical_breakdown.length).toBeGreaterThan(0);
    });

    it('should return structured JSON for chatbot type', async () => {
      const result = await simulateGemini('chatbot', {
        message: 'Hello',
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('reply');
      expect(typeof result.reply).toBe('string');
    });

    it('should handle unknown types gracefully', async () => {
      const result = await simulateGemini('nonexistent_type', {});
      expect(result).toBeDefined();
    });

    it('should return non-empty responses', async () => {
      const result = await simulateGemini('fifa_historian', {
        year: 2022,
        winner: 'Argentina',
        host: 'Qatar',
      });
      expect(result.era_tactics_title).toBeTruthy();
      expect(result.era_tactics_title.length).toBeGreaterThan(0);
    });
  });

  describe('callLiveGemini', () => {
    it('should throw error when API key is empty', async () => {
      await expect(callLiveGemini('', 'chatbot', 'Hello'))
        .rejects.toThrow('API Key is required');
    });

    it('should throw error when API key is whitespace only', async () => {
      await expect(callLiveGemini('   ', 'chatbot', 'Hello'))
        .rejects.toThrow('API Key is required');
    });

    it('should throw error when API key is null', async () => {
      await expect(callLiveGemini(null, 'chatbot', 'Hello'))
        .rejects.toThrow('API Key is required');
    });

    it('should construct proper request URL without API key in URL', async () => {
      const originalFetch = globalThis.fetch;
      let capturedUrl = '';
      globalThis.fetch = vi.fn(async (url) => {
        capturedUrl = url;
        return mockSuccessResponse();
      });

      await callLiveGemini('test-key', 'chatbot', 'Hello');

      expect(capturedUrl).not.toContain('test-key');
      expect(capturedUrl).toContain('generativelanguage.googleapis.com');
      
      globalThis.fetch = originalFetch;
    });

    it('should send API key via x-goog-api-key header', async () => {
      const originalFetch = globalThis.fetch;
      let capturedHeaders = {};
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedHeaders = options.headers;
        return mockSuccessResponse();
      });

      await callLiveGemini('my-secret-key', 'chatbot', 'Hello');

      expect(capturedHeaders['x-goog-api-key']).toBe('my-secret-key');
      expect(capturedHeaders['Content-Type']).toBe('application/json');
      
      globalThis.fetch = originalFetch;
    });

    it('should sanitize prompt text as string', async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody = '';
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedBody = options.body;
        return mockSuccessResponse();
      });

      await callLiveGemini('key', 'chatbot', null);

      const parsed = JSON.parse(capturedBody);
      expect(parsed.contents[0].parts[0].text).toBe('');
      
      globalThis.fetch = originalFetch;
    });
  });
});
