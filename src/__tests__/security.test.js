// src/__tests__/security.test.js — Security validation tests
import { describe, it, expect, vi } from 'vitest';
import { callLiveGemini } from '../utils/custom_gemini';

const mockSuccessResponse = () => ({
  ok: true,
  status: 200,
  json: async () => ({
    candidates: [
      {
        content: {
          parts: [{ text: JSON.stringify({ reply: 'Security Mock OK' }) }]
        }
      }
    ]
  })
});

describe('Security Tests', () => {
  describe('API Key Protection', () => {
    it('should never include API key in URL query parameters', async () => {
      const originalFetch = globalThis.fetch;
      let capturedUrl = '';
      globalThis.fetch = vi.fn(async (url) => {
        capturedUrl = url;
        return mockSuccessResponse();
      });

      await callLiveGemini('super-secret-key-123', 'chatbot', 'Test');

      expect(capturedUrl).not.toContain('super-secret-key-123');
      expect(capturedUrl).not.toContain('key=');
      
      globalThis.fetch = originalFetch;
    });

    it('should transmit API key only via secure HTTP header', async () => {
      const originalFetch = globalThis.fetch;
      let capturedOptions = {};
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedOptions = options;
        return mockSuccessResponse();
      });

      await callLiveGemini('my-api-key', 'chatbot', 'Test');

      expect(capturedOptions.headers['x-goog-api-key']).toBe('my-api-key');
      
      globalThis.fetch = originalFetch;
    });

    it('should trim whitespace from API keys', async () => {
      const originalFetch = globalThis.fetch;
      let capturedHeaders = {};
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedHeaders = options.headers;
        return mockSuccessResponse();
      });

      await callLiveGemini('  trimmed-key  ', 'chatbot', 'Test');

      expect(capturedHeaders['x-goog-api-key']).toBe('trimmed-key');
      
      globalThis.fetch = originalFetch;
    });
  });

  describe('Input Sanitization & Injection Defense', () => {
    it('should handle null prompt text without crashing', async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody = '';
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedBody = options.body;
        return mockSuccessResponse();
      });

      await callLiveGemini('key', 'chatbot', null);

      const parsed = JSON.parse(capturedBody);
      expect(typeof parsed.contents[0].parts[0].text).toBe('string');
      
      globalThis.fetch = originalFetch;
    });

    it('should strip script tags from prompt inputs', async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody = '';
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedBody = options.body;
        return mockSuccessResponse();
      });

      const maliciousPrompt = 'Hello <script>alert("xss")</script> stadium!';
      await callLiveGemini('key', 'chatbot', maliciousPrompt);

      const parsed = JSON.parse(capturedBody);
      const text = parsed.contents[0].parts[0].text;
      expect(text).not.toContain('<script>');
      expect(text).toContain('Hello  stadium!');

      globalThis.fetch = originalFetch;
    });

    it('should convert non-string prompts to strings', async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody = '';
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedBody = options.body;
        return mockSuccessResponse();
      });

      await callLiveGemini('key', 'chatbot', undefined);

      const parsed = JSON.parse(capturedBody);
      expect(typeof parsed.contents[0].parts[0].text).toBe('string');
      
      globalThis.fetch = originalFetch;
    });

    it('should reject empty API keys', async () => {
      await expect(callLiveGemini('', 'chatbot', 'Test'))
        .rejects.toThrow();
    });

    it('should reject whitespace-only API keys', async () => {
      await expect(callLiveGemini('   ', 'chatbot', 'Test'))
        .rejects.toThrow('API Key is required');
    });
  });

  describe('Request Security', () => {
    it('should use POST method for API calls', async () => {
      const originalFetch = globalThis.fetch;
      let capturedMethod = '';
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedMethod = options.method;
        return mockSuccessResponse();
      });

      await callLiveGemini('key', 'chatbot', 'Test');

      expect(capturedMethod).toBe('POST');
      
      globalThis.fetch = originalFetch;
    });

    it('should set Content-Type to application/json', async () => {
      const originalFetch = globalThis.fetch;
      let capturedHeaders = {};
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedHeaders = options.headers;
        return mockSuccessResponse();
      });

      await callLiveGemini('key', 'chatbot', 'Test');

      expect(capturedHeaders['Content-Type']).toBe('application/json');
      
      globalThis.fetch = originalFetch;
    });
  });
});
