declare module "jest-axe" {
  import { ElementContext } from "axe-core";

  export interface AxeViolation {
    id: string;
    impact: string | null;
    description: string;
    help: string;
    helpUrl: string;
  }

  export interface AxeResults {
    violations: AxeViolation[];
  }

  export function axe(
    html: ElementContext,
    options?: Record<string, unknown>,
  ): Promise<AxeResults>;
}
