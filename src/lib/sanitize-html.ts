/**
 * sanitizeHtml.ts
 * Server-side HTML sanitizer — zero dependency, tidak butuh window/DOM.
 *
 * Strategi: ALLOWLIST approach.
 * Hanya tag dan atribut yang secara eksplisit diizinkan yang akan lolos.
 * Semua tag lain (termasuk <script>, <iframe>, <object>, dll.) dihapus.
 *
 * Digunakan untuk membersihkan konten artikel/event dari database sebelum
 * di-render via dangerouslySetInnerHTML di halaman publik.
 */

// ============================================================
// Tag yang diizinkan
// ============================================================
const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'a', 'img',
  'div', 'span', 'section', 'article',
  'figure', 'figcaption',
]);

// ============================================================
// Atribut yang diizinkan per tag
// ============================================================
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan', 'scope']),
  // Semua tag lain: tidak ada atribut yang diizinkan (kecuali class)
};

// Atribut global yang diizinkan untuk semua tag
const GLOBAL_ALLOWED_ATTRS = new Set(['class', 'id']);

// ============================================================
// Protokol yang aman untuk atribut href dan src
// ============================================================
const SAFE_PROTOCOLS = /^(https?:|mailto:|tel:)/i;

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  // Blokir javascript:, data:, vbscript:, dll.
  return SAFE_PROTOCOLS.test(trimmed) || trimmed.startsWith('/') || trimmed.startsWith('#');
}

// ============================================================
// Sanitasi satu tag HTML
// ============================================================
function sanitizeTag(tagMatch: string): string {
  // Closing tag → hanya izinkan tag yang ada di allowlist
  const closingMatch = tagMatch.match(/^<\/\s*([a-zA-Z][a-zA-Z0-9]*)\s*>$/);
  if (closingMatch) {
    const tag = closingMatch[1].toLowerCase();
    return ALLOWED_TAGS.has(tag) ? `</${tag}>` : '';
  }

  // Self-closing atau opening tag
  const openMatch = tagMatch.match(/^<\s*([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^>]*)?)(\/?)>$/);
  if (!openMatch) return '';

  const tag = openMatch[1].toLowerCase();
  if (!ALLOWED_TAGS.has(tag)) return '';

  const attrStr = openMatch[2];
  const selfClosing = openMatch[3] === '/';

  // Parse dan filter atribut
  const allowedForTag = ALLOWED_ATTRS[tag];
  const filteredAttrs: string[] = [];

  // Regex untuk menangkap key="value", key='value', atau key=value
  const attrRegex = /([a-zA-Z][a-zA-Z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
  let attrMatch;

  while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
    const attrName = attrMatch[1].toLowerCase();
    const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

    // Cek apakah atribut diizinkan
    const isGlobal = GLOBAL_ALLOWED_ATTRS.has(attrName);
    const isTagSpecific = allowedForTag?.has(attrName) ?? false;

    if (!isGlobal && !isTagSpecific) continue;

    // Validasi URL untuk href dan src
    if ((attrName === 'href' || attrName === 'src') && !isSafeUrl(attrValue)) continue;

    // Paksa rel="noopener noreferrer" untuk link eksternal
    if (tag === 'a' && attrName === 'href' && attrValue.startsWith('http')) {
      // Tambahkan nanti di bawah
    }

    filteredAttrs.push(`${attrName}="${attrValue.replace(/"/g, '&quot;')}"`);
  }

  // Tambah rel="noopener noreferrer" otomatis untuk semua <a> dengan href eksternal
  if (tag === 'a') {
    const hasTarget = filteredAttrs.some((a) => a.startsWith('target='));
    if (!filteredAttrs.some((a) => a.startsWith('rel='))) {
      filteredAttrs.push('rel="noopener noreferrer"');
    }
    if (!hasTarget) {
      filteredAttrs.push('target="_blank"');
    }
  }

  const attrsStr = filteredAttrs.length > 0 ? ' ' + filteredAttrs.join(' ') : '';
  return selfClosing ? `<${tag}${attrsStr} />` : `<${tag}${attrsStr}>`;
}

// ============================================================
// Fungsi sanitasi utama
// ============================================================
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  // Hapus komentar HTML (bisa menyembunyikan payload)
  let clean = dirty.replace(/<!--[\s\S]*?-->/g, '');

  // Hapus semua event handler inline (onclick, onerror, dll.)
  clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

  // Hapus style attribute yang bisa digunakan untuk bypass (expression, url(), dll.)
  clean = clean.replace(/\s+style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

  // Sanitasi setiap tag HTML
  clean = clean.replace(/<[^>]+>/g, (match) => sanitizeTag(match));

  return clean;
}
