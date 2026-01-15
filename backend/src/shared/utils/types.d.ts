type StringRule = {
  required: boolean;
  type: "string";
  maxLen?: number;
  minLen?: number;
};

type UUIDRule = { required: boolean; type: "uuid" };

type EnumRule = {
  required: boolean;
  type: "enum";
  readonly values: ReadonlyArray<string>;
};

type EmailRule = { required: boolean; type: "email" };

type DateRule = { required: boolean; type: "date" };

type NumberRule = {
  required: boolean;
  type: "number";
  min?: number;
  max?: number;
};

type RuleType =
  | StringRule
  | NumberRule
  | UUIDRule
  | EnumRule
  | EmailRule
  | DateRule;

type CustomCookie = {
  cookieName: string;
  token: string;
  options: CookieOptions;
};

type TaskProps = {
  taskName: string;
  interval: string;
  task: () => Promise<void>;
};
