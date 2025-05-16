import chalk from 'chalk';

export class Logger {
   private static readonly PADDING = 12;

   private static logDetails = false;

   public static setLogDetails(state: boolean): void {
      this.logDetails = state;
   }

   public static info(...messages: any[]): void {
      console.log(chalk.cyan(this.joinMessages('[ INFO ]', ...messages)));
   }

   public static details(...messages: any[]): void {
      if (this.logDetails) {
         console.log(chalk.white(this.joinMessages('[ DETAILS ]', ...messages)));
      }
   }

   public static success(...messages: any[]): void {
      console.log(chalk.green(this.joinMessages('[ SUCCESS ]', ...messages)));
   }

   public static error(...messages: any[]): void {
      console.log(chalk.red(this.joinMessages('[ ERROR ]', ...messages)));
   }

   private static joinMessages(prefix: string, ...messages: any[]): string {
      const allMessages = [this.addPadding(prefix), ...messages];
      return allMessages.map(m => this.stringify(m)).join(' ');
   }

   private static addPadding(prefix: string): string {
      let result = prefix;
      for (let i = result.length; i < this.PADDING; i++) {
         result += ' ';
      }
      return result;
   }

   private static stringify(message: any): string {
      if (typeof message === 'object') {
         return JSON.stringify(message);
      }
      return String(message);
   }
}
