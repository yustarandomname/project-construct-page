import domainRules from "./domainRules";
import toAscii from "punycode2/to-ascii";

String.prototype.endsWith = function (suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

type ErrorCode =
  | "DOMAIN_TOO_SHORT"
  | "DOMAIN_TOO_LONG"
  | "LABEL_TOO_SHORT"
  | "LABEL_TOO_LONG"
  | "LABEL_STARTS_WITH_DASH"
  | "LABEL_ENDS_WITH_DASH"
  | "LABEL_INVALID_CHARS";

// Parse domain and find the rule that applies.
// TLD: Top level domain. eg. com, net, org
// SLD: Second level domain. eg. google,yahoo,facebook
// Domain: eg. google.com, yahoo.com, facebook.com
// Subdomain: eg. www, google, googlemail
interface Parsed {
  input: string;
  tld?: string;
  sld?: string;
  domain?: string;
  subdomain?: string;
  listed: boolean;
}

interface Rule {
  rule: string;
  suffix: string;
  punySuffix: string;
  wildcard: boolean;
  exception: boolean;
}

const errorCodes = {
  DOMAIN_TOO_SHORT: "Domain name too short.",
  DOMAIN_TOO_LONG: "Domain name too long. It should be no more than 255 chars.",
  LABEL_STARTS_WITH_DASH: "Domain name label can not start with a dash.",
  LABEL_ENDS_WITH_DASH: "Domain name label can not end with a dash.",
  LABEL_TOO_LONG: "Domain name label should be at most 63 chars long.",
  LABEL_TOO_SHORT: "Domain name label should be at least 1 character long.",
  LABEL_INVALID_CHARS: "Domain name label can only contain alphanumeric characters or dashes.",
};

const rules: Rule[] = domainRules.map((rule) => {
  return {
    rule: rule,
    suffix: rule.replace(/^(\*\.|\!)/, ""),
    punySuffix: "",
    wildcard: rule.charAt(0) === "*",
    exception: rule.charAt(0) === "!",
  };
});

// Validate if domain is a valid domain.
function validate(input: string): ErrorCode {
  const ascii = toAscii(input);

  if (ascii.length < 1) return "DOMAIN_TOO_SHORT";
  if (ascii.length > 255) return "DOMAIN_TOO_LONG";

  const labels = ascii.split(".");

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    if (label.length < 1) return "LABEL_TOO_SHORT";
    if (label.length > 63) return "LABEL_TOO_LONG";
    if (label.charAt(0) === "-") return "LABEL_STARTS_WITH_DASH";
    if (label.charAt(label.length - 1) === "-") return "LABEL_ENDS_WITH_DASH";
    if (!/^[a-z0-9\-]+$/.test(label)) return "LABEL_INVALID_CHARS";
  }
}

function findRule(domain: string): Rule {
  const punyDomain: string = toAscii(domain);

  return rules.reduce((result, rule) => {
    if (!rule.punySuffix) {
      rule.punySuffix = toAscii(rule.suffix);
    }

    if (!punyDomain.endsWith("." + rule.punySuffix) && punyDomain !== rule.punySuffix) {
      return result;
    }

    return rule;
  }, null);
}

function handlePunyCode(parsed: Parsed): Parsed {
  parsed.domain = parsed.domain ? toAscii(parsed.domain) : "";
  parsed.subdomain = parsed.subdomain ? toAscii(parsed.subdomain) : "";
  return parsed;
}

function handleNonPublicSuffix(domain: string, rule: Rule, parsed: Parsed): Parsed {
  const domainParts = domain.split(".");

  // If the domain name is Non-Internet TLD
  if (domainParts[domainParts.length - 1] === "local") return parsed;
  if (!rule) {
    if (domainParts.length < 2) return parsed;

    parsed.tld = domainParts.pop();
    parsed.sld = domainParts.pop();
    parsed.domain = parsed.sld + "." + parsed.tld;

    parsed.subdomain = domainParts.length ? domainParts.pop() : "";
    return handlePunyCode(parsed);
  }

  return null;
}

export const parse = (input: string): Parsed => {
  const domain = input.slice(0).toLowerCase();
  const domainParts = domain.split(".");
  let parsed: Parsed = {
    input,
    tld: null,
    sld: null,
    domain: null,
    subdomain: null,
    listed: false,
  };

  // validate domain
  const error = validate(domain);
  if (error) throw new Error(errorCodes[error]);

  // find the rule
  const rule = findRule(domain);

  // handle non-public suffix
  const nonPublixSuffix = handleNonPublicSuffix(domain, rule, parsed);
  if (nonPublixSuffix) return nonPublixSuffix;

  // At this point we know the public suffix is listed.
  parsed.listed = true;

  const tldParts = rule.suffix.split(".");
  let privateParts = domainParts.slice(0, domainParts.length - tldParts.length);

  if (rule.exception) {
    privateParts.push(tldParts.shift());
  }

  parsed.tld = tldParts.join(".");

  if (!privateParts.length) {
    return handlePunyCode(parsed);
  }

  if (rule.wildcard) {
    tldParts.unshift(privateParts.pop());
    parsed.tld = tldParts.join(".");
  }

  if (!privateParts.length) {
    return handlePunyCode(parsed);
  }

  parsed.sld = privateParts.pop();
  parsed.domain = parsed.sld + "." + parsed.tld;
  parsed.subdomain = parsed.subdomain ? privateParts.join(".") : parsed.subdomain;

  return handlePunyCode(parsed);
};

export const get = (input: string): string => {
  return parse(input).domain;
};

export const isValid = (input: string): boolean => {
  const parsed = parse(input);
  return parsed.domain && parsed.listed;
};
