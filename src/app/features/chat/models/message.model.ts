export interface Message {
  text: string;
  isUser: boolean;
  isPreview?: boolean;
  createdAt?: Date;
}
