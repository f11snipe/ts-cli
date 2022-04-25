import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import readLineSync from 'readline-sync';
import { parse, ArgumentConfig, ParseOptions } from 'ts-command-line-args';

import {
  ISnipeCli,
  ISnipeCliAction,
  SnipeCliArgConfig,
  ISnipeCliActionMap,
  ISnipeCliOptions,
  ISnipeCliInfo,
} from './types';

export class SnipeCli implements ISnipeCli {
  public args: string[];
  public options: any;
  public name: string;
  public description: string;
  public info: ISnipeCliInfo;
  public version: string;
  public actions: ISnipeCliActionMap;
  public parseConfig: ArgumentConfig<SnipeCliArgConfig>;
  public parseOptions: ParseOptions<SnipeCliArgConfig> extends { [name: string]: any } ? any : any;
  public defaultValidateArg: (input: string) => boolean;

  constructor(options: ISnipeCliOptions) {
    this.name = options.name;
    this.description = options?.description || this.name;
    this.version = options?.version || 'v1';
    this.actions = options?.actions || {};
    this.defaultValidateArg = options?.defaultValidateArg || ((input: string) => !!(input && input.trim() !== ''));
  }

  public select(items: string[], query?: any, options?: readLineSync.BasicOptions): number {
    return readLineSync.keyInSelect(items, query, options);
  }

  public prompt(query?: any, options?: readLineSync.BasicOptions): string {
    return readLineSync.question(query, options);
  }

  public confirm(query?: any, options?: readLineSync.BasicOptions): string | boolean {
    return readLineSync.keyInYN(query, options);
  }

  public init<T>(config?: ArgumentConfig<T>, options?: ParseOptions<T>): void {
    this.parseConfig = {
      action: { type: String, optional: true, alias: 'a', multiple: true, defaultOption: true },
      version: { type: Boolean, optional: true, description: '' },
      verbose: { type: Boolean, optional: true, description: '' },
      quiet: { type: Boolean, optional: true, description: '' },
      help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
      ...config,
    };

    this.parseOptions = {
      helpArg: 'help',
      headerContentSections: [
        { header: this.name, content: this.description },
        { header: 'Version', content: this.version },
      ],
      footerContentSections: Object.keys(this.actions).map((action) => ({
        header: `Examples (${action} action)`,
        content: this.actions[action].examples?.join(`\n`) || 'None',
      })),
      ...options,
    };

    this.options = parse<T | SnipeCliArgConfig>(this.parseConfig, this.parseOptions);

    if (this.options.action) {
      this.args = [...this.options.action];
    }

    this.load();
    this.run();
  }

  public run(): void {
    if (Object.keys(this.actions).length && this.options.action) {
      const actionName = this.args.shift();

      if (actionName && this.actions[actionName]) {
        this.actions[actionName].run(this);
      } else {
        throw new Error(`Missing/invalid action: '${actionName}'`);
      }
    }
  }

  public load(): void {
    this.info = {
      cwd: process.cwd(),
      pkg: require(path.join(__dirname, '..', 'package')),
      os: {
        hostname: os.hostname(),
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
      },
      user: os.userInfo(),
      context: {},
      installPath: path.join(__dirname, '..'),
    };

    const files = fs.readdirSync(this.info.cwd);

    files.forEach((file) => {
      if (/dockerfile/i.test(file)) {
        this.info.context.docker = true;
      }

      if (/docker-compose\.ya?ml/i.test(file)) {
        this.info.context.dockerCompose = true;
      }

      if (/gemfile/i.test(file)) {
        this.info.context.rails = true;
      }

      if (/package\.json/i.test(file)) {
        this.info.context.node = true;
        this.info.context.pkg = require(path.join(this.info.cwd, file));
      }

      if (/makefile/i.test(file)) {
        this.info.context.make = true;
        this.info.context.makefile = fs.readFileSync(file);
      }
    });
  }

  public debug(): void {
    console.log('DEBUG:', this);
  }

  public registerAction(name: string, action: ISnipeCliAction): void {
    if (this.actions[name]) {
      throw new Error(`Action already registered: '${name}'`);
    }

    this.actions[name] = action;
  }

  public getArgOrPrompt(
    index: number,
    prompt: string,
    defaultValue?: string,
    validate?: (input: string) => boolean,
  ): string {
    let fullPrompt = prompt;

    if (defaultValue) {
      fullPrompt += '(optional)';
    }

    const argValue = this.args[index] || this.prompt(fullPrompt);
    const validateArg = validate || this.defaultValidateArg;

    if (validateArg(argValue)) {
      return argValue;
    } else if (!defaultValue) {
      console.log('Invalid arg', index, prompt);

      if (this.args[index]) {
        this.args.splice(index, 1);
      }

      return this.getArgOrPrompt(index, prompt, defaultValue, validate);
    }

    return defaultValue;
  }
}
