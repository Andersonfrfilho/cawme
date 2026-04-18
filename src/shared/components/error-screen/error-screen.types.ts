export type ErrorVariant = 'network' | '404' | '409' | '500' | 'generic';

export type ErrorScreenProps = {
  variant: ErrorVariant;
  onRetry?: () => void;
  onBack?: () => void;
  onOther?: () => void;
  otherLabel?: string;
  title?: string;
  message?: string;
};
