import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '@/lib/sanitize-html';

describe('HTML Sanitizer (Bab 8.3 & Security Hardening)', () => {
  it('should return empty string when input is null, undefined, or empty', () => {
    // @ts-expect-error testing falsy inputs
    expect(sanitizeHtml(null)).toBe('');
    // @ts-expect-error testing falsy inputs
    expect(sanitizeHtml(undefined)).toBe('');
    expect(sanitizeHtml('')).toBe('');
  });

  it('should allow benign HTML tags like p, strong, h1, ul, li', () => {
    const safeInput = '<h1>Judul Layanan</h1><p>Penjelasan <strong>tebal</strong> dan <em>miring</em>.</p>';
    const output = sanitizeHtml(safeInput);
    expect(output).toBe('<h1>Judul Layanan</h1><p>Penjelasan <strong>tebal</strong> dan <em>miring</em>.</p>');
  });

  it('should strip malicious script tags completely', () => {
    const maliciousInput = '<p>Halo</p><script>alert("XSS")</script>';
    const output = sanitizeHtml(maliciousInput);
    expect(output).not.toContain('<script>');
    expect(output).not.toContain('</script>');
    expect(output).toContain('<p>Halo</p>');
  });

  it('should strip dangerous inline event handlers like onerror or onclick', () => {
    const attack = '<img src="invalid.jpg" onerror="alert(1)" alt="test" />';
    const output = sanitizeHtml(attack);
    expect(output).not.toContain('onerror');
    expect(output).toContain('<img');
    expect(output).toContain('alt="test"');
  });

  it('should block javascript: pseudo-protocol in links', () => {
    const attack = '<a href="javascript:alert(\'hack\')">Klik Disini</a>';
    const output = sanitizeHtml(attack);
    expect(output).not.toContain('javascript:');
  });

  it('should automatically append rel="noopener noreferrer" and target="_blank" to external links', () => {
    const externalLink = '<a href="https://aisyiyah.or.id">Website Aisyiyah</a>';
    const output = sanitizeHtml(externalLink);
    expect(output).toContain('rel="noopener noreferrer"');
    expect(output).toContain('target="_blank"');
    expect(output).toContain('href="https://aisyiyah.or.id"');
  });
});
