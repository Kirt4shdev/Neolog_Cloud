type SendEmailOptions = {
  to: string | Array<string>;
  subject: string;
  html: string;
  from?: string;
};
