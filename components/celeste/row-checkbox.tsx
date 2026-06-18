'use client';

import { useEffect, useRef } from 'react';

export function RowCheckbox({
  checked,
  indeterminate,
  onChange,
  'aria-label': ariaLabel,
}: {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: () => void;
  'aria-label': string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked ?? false}
      onChange={() => onChange?.()}
      aria-label={ariaLabel}
      className="size-4 cursor-pointer rounded border-border accent-primary"
    />
  );
}
