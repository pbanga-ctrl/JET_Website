import Image from "next/image";

// White knockout of /logo/jet-automation-logo.jpg: same artwork, paper
// dropped out, ink turned white. It is not redrawn or stretched.
//
// The header already names the brand, so this mark is decorative (empty
// alt). It sits under the header's z-50: on desktop the header is off-screen
// until scroll and this occupies the hero's top-right; on a phone the header
// is always in that corner, so the mark starts below it. The dark plate is
// only there so the white ink stays readable on the light scrim and the
// bright parts of the plant footage.
export function HeroWordmark() {
  return (
    <div className="absolute right-4 top-[5.25rem] z-30 md:right-8 md:top-6">
      <div className="bg-secondary px-2.5 py-1.5">
        <Image
          src="/logo/jet-automation-logo-white.png"
          alt=""
          width={199}
          height={113}
          className="h-7 w-auto md:h-9"
        />
      </div>
    </div>
  );
}
