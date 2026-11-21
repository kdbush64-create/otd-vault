// Adds a live character counter under a Keystatic field, without changing how the field saves.
import { createElement as h } from 'react';

type Limits = { min?: number; max?: number; recommendMax?: number };

function countOf(value: unknown): number {
  if (typeof value === 'string') return value.length;
  if (value && typeof value === 'object' && typeof (value as any).name === 'string') {
    return (value as any).name.length; // slug fields (Title) store { name, slug }
  }
  return 0;
}

function Counter({ value, min, max, recommendMax }: Limits & { value: unknown }) {
  const n = countOf(value);
  let text = `${n} characters`;
  let color = 'inherit';
  if (max !== undefined) {
    text = `${n} / ${max}`;
    if (n > max) { color = '#e5534b'; text += ` — ${n - max} over the limit`; }
    else if (min !== undefined && n > 0 && n < min) { color = '#b26a00'; text += ` — ${min - n} more needed (minimum ${min})`; }
  } else if (recommendMax !== undefined) {
    const prefix = value && typeof value === 'object' ? 'Title: ' : '';
    text = `${prefix}${n} characters — aim for under ${recommendMax} for search results`;
    if (n > recommendMax) color = '#b26a00';
  }
  return h('div', {
    'aria-live': 'polite',
    style: { fontSize: '12px', marginTop: '6px', color, opacity: color === 'inherit' ? 0.75 : 1, fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  }, text);
}

export function withCounter<F extends { Input: (props: any) => any }>(field: F, limits: Limits): F {
  const BaseInput = field.Input;
  return {
    ...field,
    Input(props: any) {
      return h('div', null, h(BaseInput, props), h(Counter, { value: props.value, ...limits }));
    },
  };
}
