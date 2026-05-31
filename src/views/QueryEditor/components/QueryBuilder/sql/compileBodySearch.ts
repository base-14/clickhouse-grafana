import { quote } from './util';

const tokenize = (raw: string): string[] =>
  raw
    .split(/[^A-Za-z0-9_]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);

export const compileBodySearch = (raw: string | undefined, isRegex: boolean): string | null => {
  if (!raw || !raw.trim()) {
    return null;
  }
  if (isRegex) {
    return `match(Body, ${quote(raw)})`;
  }
  const tokens = tokenize(raw);
  if (tokens.length === 0) {
    return null;
  }
  return tokens.map((t) => `hasToken(Body, ${quote(t)})`).join(' AND ');
};
