import { ViewTransition } from "react";

const enterMap = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "fade-in",
};

const exitMap = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "fade-out",
};

/**
 * Wraps a page's content so route navigations crossfade by default.
 * Links tagged with transitionTypes={['nav-forward' | 'nav-back']}
 * (e.g. Careers -> Job detail) get a directional slide instead.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={enterMap} exit={exitMap}>
      {children}
    </ViewTransition>
  );
}
