import type { SVGProps } from 'react';

/**
 * Crescent moon hero glyph that sits above the greeting on the chat landing.
 *
 * Lifted verbatim from the Figma asset (file DIVjXB7LipC4L4Ekgombtj,
 * node 3326:2799). Two overlapping circles with drop shadows:
 *   • dark teal disc (#225D68) — the moon body
 *   • cream disc (#F7F7F8 at 80%) offset to the right — the lit limb that
 *     creates the crescent silhouette
 *
 * Filter IDs are namespaced (`celeste-moon-*`) so they don't collide if the
 * SVG is rendered more than once in the same document.
 */
export function MoonGlyph({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 113.565 113.565"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      className={className}
      {...props}
    >
      <g>
        <g filter="url(#celeste-moon-body-shadow)">
          <circle
            cx="56.7826"
            cy="56.7826"
            r="24.7826"
            transform="rotate(-180 56.7826 56.7826)"
            fill="#225D68"
          />
        </g>
        <g opacity="0.8" filter="url(#celeste-moon-limb-shadow)">
          <circle
            cx="66.6956"
            cy="56.782"
            r="22.3043"
            transform="rotate(-180 66.6956 56.782)"
            fill="#F7F7F8"
          />
        </g>
      </g>
      <defs>
        <filter
          id="celeste-moon-body-shadow"
          x="0"
          y="0"
          width="113.565"
          height="113.565"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="16" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0313726 0 0 0 0 0.290196 0 0 0 0 0.290196 0 0 0 0.32 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
        <filter
          id="celeste-moon-limb-shadow"
          x="41.3913"
          y="32.4777"
          width="48.6087"
          height="48.6087"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
