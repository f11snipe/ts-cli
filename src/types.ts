import { UserInfo } from 'os';
import readLineSync from 'readline-sync';
import { ArgumentConfig, ParseOptions } from 'ts-command-line-args';

export interface ISnipeCliAction {
  run: (cli: ISnipeCli) => void;
  description: string;
  examples?: string[];
}

export interface ISnipeCliActionMap {
  [name: string]: ISnipeCliAction;
}

export interface ISnipeCliOptions {
  name: string;
  description?: string;
  version?: string;
  actions?: ISnipeCliActionMap;
  defaultValidateArg?: (input: string) => boolean;
}

export interface SnipeCliArgConfig {
  action?: string[];
  version?: boolean;
  verbose?: boolean;
  quiet?: boolean;
  help?: boolean;
}

export interface ISnipeCliInfo {
  cwd: string;
  pkg: any;
  os: {
    hostname: string;
    platform: string;
    release: string;
    type: string;
  };
  user: UserInfo<string>;
  context: {
    pkg?: any;
    node?: boolean;
    rails?: boolean;
    docker?: boolean;
    dockerCompose?: boolean;
    make?: boolean;
    makefile?: Buffer;
  };
  installPath: string;
}

export interface ISnipeCli {
  args: string[];
  options: any;
  name: string;
  description: string;
  info: ISnipeCliInfo;
  version: string;
  actions: ISnipeCliActionMap;
  parseConfig: ArgumentConfig<SnipeCliArgConfig>;
  parseOptions: ParseOptions<SnipeCliArgConfig> extends { [name: string]: any } ? any : any;

  defaultValidateArg: (input: string) => boolean;

  select(items: string[], query?: any, options?: readLineSync.BasicOptions): number;

  prompt(query?: any, options?: readLineSync.BasicOptions): string;

  confirm(query?: any, options?: readLineSync.BasicOptions): string | boolean;

  init<T>(config?: ArgumentConfig<T>, options?: ParseOptions<T>): void;
  run(): void;
  load(): void;
  debug(): void;

  registerAction(name: string, action: ISnipeCliAction): void;

  getArgOrPrompt(
    index: number,
    prompt: string,
    defaultValue?: string | null,
    validate?: (input: string) => boolean,
  ): string;
}
