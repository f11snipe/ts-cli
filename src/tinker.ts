import { SnipeCli, ISnipeCliActionMap } from '../src';

interface ICopyFilesArguments {
  // sourcePath: string;
  // targetPath: string;
  // copyFiles: boolean;
  // resetPermissions: boolean;
  // filter?: string;
  excludePaths?: string[];
  // help?: boolean;
}

const actions: ISnipeCliActionMap = {
  ssm: {
    description: 'SSM Action',
    examples: ['ssm example'],
    run: (cli) => {
      const { pkg } = cli.info;

      const ssmAction = cli.getArgOrPrompt(0, 'SSM Action (ls|new|get|rm): ').toLowerCase();
      const paramName = cli.getArgOrPrompt(1, 'Parameter Name: ', null, (name) => /^[a-zA-Z0-9_\.\-]+$/.test(name));
      const paramValue = cli.getArgOrPrompt(2, 'Parameter Value: ');
      const paramDesc = cli.getArgOrPrompt(3, 'Parameter Description: ', `Created by ${pkg.name}@${pkg.version}`);

      console.log('DEBUG:', {
        ssmAction,
        paramName,
        paramValue,
        paramDesc,
      });
    },
  },
};

const exampleCli = new SnipeCli({
  name: 'Example CLI',
  version: 'v1.2.3',
  // actions
});

exampleCli.registerAction('ssm', actions.ssm);

// exampleCli.init();

exampleCli.init<ICopyFilesArguments>(
  {
    // sourcePath: String,
    // targetPath: String,
    // copyFiles: { type: Boolean, alias: 'c', description: 'Copies files rather than moves them' },
    // resetPermissions: Boolean,
    // filter: { type: String, optional: true },
    excludePaths: { type: String, multiple: true, optional: true },
    // help: { type: Boolean, optional: true, alias: 'h', description: 'Prints OTHER usage guide' },
  },
  {
    // helpArg: 'help',
    // headerContentSections: [{ header: 'Extended Header', content: 'More header content' }],
    // footerContentSections: [{ header: 'Footer EXTENDED', content: `Footer content extended...` }],
  },
);

// console.log('using sourcePath', exampleCli.options.sourcePath);
// console.log('using targetPath', exampleCli.options.targetPath);

// const response = exampleCli.select([ 'A', 'B', 'C']);

// console.log('Selected:', response);

// const value = exampleCli.prompt('Enter something:');

// console.log('Value:', value);

if (exampleCli.confirm('Show debug output?')) {
  exampleCli.debug();
}
