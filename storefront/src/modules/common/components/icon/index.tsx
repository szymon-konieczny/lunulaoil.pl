import Image from "next/image"

type IconProps = {
  name: string
  size?: number
  className?: string
  alt?: string
}

const Icon = ({ name, size = 24, className = "", alt = "" }: IconProps) => {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={alt}
      width={size}
      height={size}
      className={className}
      aria-hidden={!alt}
    />
  )
}

export default Icon
