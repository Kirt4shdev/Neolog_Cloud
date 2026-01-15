interface PostTaskServiceProps {
  title: string;
  interval: string;
  executeStatus: boolean;
  executedAt: Date;
  error?: string | null;
}
