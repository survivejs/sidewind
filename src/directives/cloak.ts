import { DirectiveParameters } from "../types";

function cloakDirective({ element }: DirectiveParameters) {
  element.removeAttribute("hidden");
}
cloakDirective.skipEvaluation = true;

export default cloakDirective;
