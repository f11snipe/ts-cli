import colors from 'colors/safe';

enum LogTextColor {
  BLACK = 'black',
  RED = 'red',
  GREEN = 'green',
  YELLOW = 'yellow',
  BLUE = 'blue',
  MAGENTA = 'magenta',
  CYAN = 'cyan',
  WHITE = 'white',
  GRAY = 'gray',
  GREY = 'grey',
  BRIGHT_RED = 'brightRed',
  BRIGHT_GREEN = 'brightGreen',
  BRIGHT_YELLOW = 'brightYellow',
  BRIGHT_BLUE = 'brightBlue',
  BRIGHT_MAGENTA = 'brightMagenta',
  BRIGHT_CYAN = 'brightCyan',
  BRIGHT_WHITE = 'brightWhite',
}

enum LogTextBgColor {
  BLACK = 'bgBlack',
  RED = 'bgRed',
  GREEN = 'bgGreen',
  YELLOW = 'bgYellow',
  BLUE = 'bgBlue',
  MAGENTA = 'bgMagenta',
  CYAN = 'bgCyan',
  WHITE = 'bgWhite',
  GRAY = 'bgGray',
  GREY = 'bgGrey',
  BRIGHT_RED = 'bgBrightRed',
  BRIGHT_GREEN = 'bgBrightGreen',
  BRIGHT_YELLOW = 'bgBrightYellow',
  BRIGHT_BLUE = 'bgBrightBlue',
  BRIGHT_MAGENTA = 'bgBrightMagenta',
  BRIGHT_CYAN = 'bgBrightCyan',
  BRIGHT_WHITE = 'bgBrightWhite',
}

enum LogTextStyle {
  RESET = 'reset',
  BOLD = 'bold',
  DIM = 'dim',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  INVERSE = 'inverse',
  HIDDEN = 'hidden',
  STRIKETHROUGH = 'strikethrough',
  RAINBOW = 'rainbow',
  ZEBRA = 'zebra',
  AMERICA = 'america',
  TRAP = 'trap',
  RANDOM = 'random',
}

type LogTextThemeValue = LogTextColor | LogTextBgColor | LogTextStyle;

interface LogTextTheme {
  [theme: string]: LogTextThemeValue | LogTextThemeValue[];
}

interface LogOptions {
  timestamp?: boolean;
  throws?: boolean;
  prefix?: string;
  theme?: string;
  color?: LogTextColor;
}

type LogMag = {
  timestamp: true;
};

type LogMethod = (...args: any[]) => void;

interface ILogger {
  colorize: (args: any, color: LogTextColor) => any;

  timestamp: () => string;

  log: (args: any, options?: LogOptions) => void;
  out: (options?: LogOptions) => LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  // warn: () => void;
  // debug: () => void;
  // error: () => void;
  // success: () => void;
}

export class SnipeLogger implements ILogger {
  constructor(public theme?: LogTextTheme) {
    if (theme) {
      colors.setTheme(theme);
    }
  }

  timestamp(): string {
    // Create new Date object
    const d = new Date();

    // Return date in the format "M/D/YYYY h:i:s AM/PM"
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  colorize(args: any, color: LogTextThemeValue | string): any {
    if (typeof args === 'string') {
      return colors[color](args);
    } else if (typeof args === 'object') {
      if (Array.isArray(args)) {
        return args.map((arg) => (typeof arg === 'string' ? colors[color](arg) : arg));
      } else {
        const argsCopy = { ...args };

        Object.keys(argsCopy).forEach((key) => {
          if (typeof argsCopy[key] === 'string') {
            argsCopy[key] = colors[color](argsCopy[key]);
          }
        });

        return argsCopy;
      }
    }

    return args;
  }

  log(args: any, options?: LogOptions) {
    let output = Array.isArray(args) ? [...args] : [args];

    if (options?.prefix) {
      output = [options.prefix].concat(output);
    }

    if (options?.timestamp) {
      output = [`[${this.timestamp()}]`].concat(output);
    }

    if (options?.color) {
      output = this.colorize(output, options.color);
    }

    if (options?.theme) {
      output = this.colorize(output, options.theme);
    }

    console.log(...output);
  }

  out =
    (options?: LogOptions) =>
    (...args: any[]) =>
      this.log(args, options);

  info = this.out({
    prefix: 'INFO',
    timestamp: true,
  });

  warn = this.out({
    prefix: 'WARNING',
    timestamp: true,
    color: LogTextColor.YELLOW,
  });

  error = this.out({
    prefix: 'ERROR',
    timestamp: true,
    color: LogTextColor.RED,
  });
}

const myLogger = new SnipeLogger({
  custom: [LogTextColor.RED, LogTextStyle.UNDERLINE],
});

myLogger.info('This is from info()', 'with', 'args', ['and', 'more'], { dynamic: 'types' }, null, true, undefined);
myLogger.warn('this is a warning!');
myLogger.error('Another ERROR!');

// myLogger.out({ theme: 'custom' })('Example with custom theme usage');

// colors.setTheme({
//   custom: ['red', 'underline']
// });

// console.log(colors.green('hello')); // outputs green text
// console.log(colors['custom']('i like cake and pies')) // outputs red underlined text
// console.log(colors.inverse('inverse the color')); // inverses the color
// console.log(colors.rainbow('OMG Rainbows!')); // rainbow
// console.log(colors.trap('Run the trap')); // Drops the bass
