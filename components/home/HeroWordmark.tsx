import Image from "next/image";

// White knockout of /logo/jet-automation-logo.jpg: same artwork, paper
// dropped out, ink turned white. It is not redrawn or stretched, and it
// has no plate — the PNG is transparent and nothing is painted behind it.
//
// The header already names the brand, so this mark is decorative (empty
// alt). It sits under the header's z-50: on desktop the header is off-screen
// until scroll and this occupies the hero's top-right; on a phone the header
// (and its menu button) owns that corner, so the mark starts below it.
export function HeroWordmark() {
  return (
    <div className="absolute right-4 top-[5.25rem] z-30 md:right-8 md:top-6">
      <Image
        src="/logo/jet-automation-logo-white.png"
        alt=""
        width={199}
        height={113}
        className="h-9 w-auto md:h-12"
      />
    </div>
  );
}
