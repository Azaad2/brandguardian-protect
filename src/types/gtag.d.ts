
interface Window {
  gtag: (
    command: string,
    action: string,
    params?: {
      event_category?: string;
      event_label?: string;
      event_value?: string | number;
      [key: string]: any;
    }
  ) => void;
  dataLayer: any[];
}
