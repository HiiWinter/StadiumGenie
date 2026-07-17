// src/__tests__/security.test.js — Security validation tests
import { describe, it, expect, vi } from 'vitest';
import { callLiveGemini } from '../utils/custom_gemini';

describe('Security Tests', () => {
  describe('API Key Protection', () => {
    it('should never include API key in URL query parameters', async () => {
      const originalFetch = globalThis.fetch;
      let capturedUrl = '';
      globalThis.fetch = vi.fn(async (url) => {
        capturedUrl = url;
        return { ok: false, status: 401, text: async () => 'Unauthorized' };
      });

      try {
        await callLiveGemini('super-secret-key-123', 'chatbot', 'Test');
      } catch {
        // Expected
      }

      expect(capturedUrl).not.toContain('super-secret-key-123');
      expect(capturedUrl).not.toContain('key=');
      
      globalThis.fetch = originalFetch;
    });

    it('should transmit API key only via secure HTTP header', async () => {
      const originalFetch = globalThis.fetch;
      let capturedOptions = {};
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedOptions = options;
        return { ok: false, status: 401, text: async () => 'Unauthorized' };
      });

      try {
        await callLiveGemini('my-api-key', 'chatbot', 'Test');
      } catch {
        // Expected
      }

      expect(capturedOptions.headers['x-goog-api-key']).toBe('my-api-key');
      
      globalThis.fetch = originalFetch;
    });

    it('should trim whitespace from API keys', async () => {
      const originalFetch = globalThis.fetch;
      let capturedHeaders = {};
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedHeaders = options.headers;
        return { ok: false, status: 401, text: async () => 'Unauthorized' };
      });

      try {
        await callLiveGemini('  trimmed-key  ', 'chatbot', 'Test');
      } catch {
        // Expected
      }

      expect(capturedHeaders['x-goog-api-key']).toBe('trimmed-key');
      
      globalThis.fetch = originalFetch;
    });
  });

  describe('Input Sanitization', () => {
    it('should handle null prompt text without crashing', async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody = '';
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedBody = options.body;
        return { ok: false, status: 401, text: async () => 'Unauthorized' };
      });

      try {
        await callLiveGemini('key', 'chatbot', null);
      } catch {
        // Expected
      }

      const parsed = JSON.parse(capturedBody);
      expect(typeof parsed.contents[0].parts[0].text).toBe('string');
      
      globalThis.fetch = originalFetch;
    });

    it('should convert non-string prompts to strings', async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody = '';
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedBody = options.body;
        return { ok: false, status: 401, text: async () => 'Unauthorized' };
      });

      try {
        await callLiveGemini('key', 'chatbot', undefined);
      } catch {
        // Expected
      }

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
        return { ok: false, status: 401, text: async () => 'Unauthorized' };
      });

      try {
        await callLiveGemini('key', 'chatbot', 'Test');
      } catch {
        // Expected
      }

      expect(capturedMethod).toBe('POST');
      
      globalThis.fetch = originalFetch;
    });

    it('should set Content-Type to application/json', async () => {
      const originalFetch = globalThis.fetch;
      let capturedHeaders = {};
      globalThis.fetch = vi.fn(async (_url, options) => {
        capturedHeaders = options.headers;
        return { ok: false, status: 401, text: async () => 'Unauthorized' };
      });

      try {
        await callLiveGemini('key', 'chatbot', 'Test');
      } catch {
        // Expected
      }

      expect(capturedHeaders['Content-Type']).toBe('application/json');
      
      globalThis.fetch = originalFetch;
    });
  });
});
