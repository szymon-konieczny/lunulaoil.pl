import { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { className?: string }

const defaultProps: IconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

/** Dry skin — cracked desert/drought */
export function IconDrySkin(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

/** Oily skin — droplet */
export function IconOilySkin(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
    </svg>
  )
}

/** Combination — balance scales */
export function IconBalance(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M12 3v18" />
      <path d="M6 7l-4 8h8L6 7z" />
      <path d="M18 7l-4 8h8L18 7z" />
      <path d="M6 3h12" />
    </svg>
  )
}

/** Normal skin — sparkle/star */
export function IconSparkle(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
    </svg>
  )
}

/** Sensitive skin — flower/petal */
export function IconFlower(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a4 4 0 0 1 0 6 4 4 0 0 1 0-6z" />
      <path d="M17.66 6.34a4 4 0 0 1-4.24 4.24 4 4 0 0 1 4.24-4.24z" />
      <path d="M22 12a4 4 0 0 1-6 0 4 4 0 0 1 6 0z" />
      <path d="M17.66 17.66a4 4 0 0 1-4.24-4.24 4 4 0 0 1 4.24 4.24z" />
      <path d="M12 22a4 4 0 0 1 0-6 4 4 0 0 1 0 6z" />
      <path d="M6.34 17.66a4 4 0 0 1 4.24-4.24 4 4 0 0 1-4.24 4.24z" />
      <path d="M2 12a4 4 0 0 1 6 0 4 4 0 0 1-6 0z" />
      <path d="M6.34 6.34a4 4 0 0 1 4.24 4.24A4 4 0 0 1 6.34 6.34z" />
    </svg>
  )
}

/** Aging — hourglass */
export function IconHourglass(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M5 3h14M5 21h14" />
      <path d="M7 3v4a5 5 0 0 0 5 5 5 5 0 0 0 5-5V3" />
      <path d="M7 21v-4a5 5 0 0 1 5-5 5 5 0 0 1 5 5v4" />
    </svg>
  )
}

/** Glow — radiance/shine */
export function IconGlow(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

/** Imperfections — magnifying glass */
export function IconSearch(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

/** Scars — healing/bandage */
export function IconHealing(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M18.4 5.6a4.24 4.24 0 0 0-6 0L5.6 12.4a4.24 4.24 0 0 0 6 6l6.8-6.8a4.24 4.24 0 0 0 0-6z" />
      <line x1="10" y1="10" x2="10.01" y2="10" />
      <line x1="14" y1="14" x2="14.01" y2="14" />
      <line x1="12" y1="12" x2="12.01" y2="12" />
    </svg>
  )
}

/** Hair care — flowing strands */
export function IconHair(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M4 20c0-7 4-12 8-12s8 5 8 12" />
      <path d="M8 20c0-5 2-8 4-8s4 3 4 8" />
      <path d="M12 8V2" />
    </svg>
  )
}

/** Face — elegant face outline */
export function IconFace(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M12 2C8 2 5 5.6 5 10c0 3 .8 5.4 2.4 7.2C8.8 18.8 10.2 22 12 22s3.2-3.2 4.6-4.8C18.2 15.4 19 13 19 10c0-4.4-3-8-7-8z" />
    </svg>
  )
}

/** Body — body silhouette */
export function IconBody(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="12" cy="4" r="2" />
      <path d="M16 22v-6l2.5-3.5-3-3a2 2 0 0 0-3 0l-3 3L12 16v6" />
      <path d="M8 22v-6l-2.5-3.5 3-3a2 2 0 0 1 3 0l3 3L12 16v6" />
    </svg>
  )
}

/** Hair & scalp — head massage */
export function IconHeadMassage(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="12" cy="8" r="6" />
      <path d="M9 20h6" />
      <path d="M12 14v6" />
      <path d="M7 4c-1-2 0-3 2-3" />
      <path d="M17 4c1-2 0-3-2-3" />
    </svg>
  )
}

/** Universal — leaf/nature */
export function IconLeaf(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M12 22c-4-4-8-8-8-14a8 8 0 0 1 16 0c0 6-4 10-8 14z" />
      <path d="M12 8v8" />
      <path d="M9 11l3-3 3 3" />
    </svg>
  )
}

/** Light texture — feather */
export function IconFeather(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  )
}

/** Rich texture — honey/jar */
export function IconRich(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M10 2h4v4h-4z" />
      <path d="M7 6h10a1 1 0 0 1 1 1v2a4 4 0 0 1-2 3.46V20a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-7.54A4 4 0 0 1 6 9V7a1 1 0 0 1 1-1z" />
    </svg>
  )
}

/** No preference — open hands */
export function IconOpenHands(props: IconProps) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M18 8a2 2 0 0 0-4 0v6" />
      <path d="M10 8a2 2 0 0 0-4 0v6" />
      <path d="M6 14v2a6 6 0 0 0 12 0v-2" />
      <path d="M12 2v4" />
    </svg>
  )
}

/** Map icon keys to components */
export const quizIcons: Record<string, (props: IconProps) => JSX.Element> = {
  dry_skin: IconDrySkin,
  oily_skin: IconOilySkin,
  balance: IconBalance,
  sparkle: IconSparkle,
  flower: IconFlower,
  hourglass: IconHourglass,
  glow: IconGlow,
  search: IconSearch,
  healing: IconHealing,
  hair: IconHair,
  face: IconFace,
  body: IconBody,
  head_massage: IconHeadMassage,
  leaf: IconLeaf,
  feather: IconFeather,
  rich: IconRich,
  open_hands: IconOpenHands,
}
