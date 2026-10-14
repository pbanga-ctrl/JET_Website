import Image from "next/image";

// White knockout of /logo/jet-automation-logo.jpg: same artwork, paper
// dropped out, ink turned white. It is not redrawn or stretched, and it
// has no plate — the PNG is transparent and nothing is painted behind it.
//
// The header already names the brand, so this mark is decorative (empty
// alt). It is desktop-only (`md`, 768px): that is the same breakpoint where
// the home header stays off-screen until scroll, so the top-right is empty.
// Below that the header, including the menu button, is always in the corner,
// and the mark is not rendered. Once the desktop header slides in it covers
// this mark (the header is z-50).
export function HeroWordmark() {
  return (
    <div className="absolute right-8 top-6 z-30 hidden md:block">
      <Image
        src="/logo/jet-automation-logo-white.png"
        alt=""
        width={199}
        height={113}
        className="h-12 w-auto"
      />
    </div>
  );
}
