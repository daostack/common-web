export interface INotification {
  send: (tokens: string[], title: string, body: string, image: string, options: any) => Promise<void>
}