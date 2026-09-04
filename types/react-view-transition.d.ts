// Next.js 16's App Router runs on a React canary that ships `ViewTransition`
// (see node_modules/next/dist/docs/01-app/02-guides/view-transitions.md).
// @types/react (stable channel) doesn't declare it yet, so this augments
// the module with the documented prop shape.
import "react";

declare module "react" {
  type ViewTransitionAnimation = "auto" | "none" | (string & {});

  interface ViewTransitionProps {
    name?: string;
    share?: ViewTransitionAnimation;
    enter?: ViewTransitionAnimation | Record<string, ViewTransitionAnimation>;
    exit?: ViewTransitionAnimation | Record<string, ViewTransitionAnimation>;
    default?: ViewTransitionAnimation;
    children?: ReactNode;
  }

  export const ViewTransition: (props: ViewTransitionProps) => ReactElement;
}
