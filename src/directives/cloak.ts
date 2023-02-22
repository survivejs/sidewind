import type { DirectiveParameters } from "../../types.ts";

function cloakDirective({ element }: DirectiveParameters) {
  element.removeAttribute("hidden");
}
cloakDirective.skipEvaluation = true;

export default cloakDirective;
