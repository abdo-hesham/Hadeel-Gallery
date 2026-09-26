// Small text-splitting helpers for reveal animations (no SplitText plugin needed).
// Split output is aria-hidden; screen readers get the plain text from a visually
// hidden copy (aria-label is not allowed on a plain <span>).

export function SplitLines({ lines, className = '', lineClass = 'line' }) {
  return (
    <span className={className}>
      {lines.map((l, i) => (
        <span className="line-mask" key={i}>
          <span className={lineClass}>{l}</span>
        </span>
      ))}
    </span>
  );
}

// Words stay unbreakable, every letter gets its own span (for per-letter colour reveals).
export function SplitWordChars({ text, className = '' }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {text.split(' ').map((word, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="word">
            {Array.from(word).map((c, ci) => <span className="char" key={ci}>{c}</span>)}
          </span>
          {' '}
        </span>
      ))}
    </span>
  );
}

export function SplitChars({ text, className = '' }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((c, i) => (
        <span className="char-mask" key={i} aria-hidden="true">
          <span className="char">{c === ' ' ? ' ' : c}</span>
        </span>
      ))}
    </span>
  );
}
