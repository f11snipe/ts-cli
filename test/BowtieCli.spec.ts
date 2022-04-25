import { SnipeCli } from '../src';

describe('SnipeCli', () => {
  it('exists', () => {
    expect(SnipeCli).toBeDefined();
  });

  it('can be created with min props', () => {
    const cli = new SnipeCli({
      name: 'Test CLI'
    });

    expect(cli).toBeDefined();
  });
});
