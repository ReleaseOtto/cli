import { Flags } from '@oclif/core';
import { load } from '../utils/OttoFile';
import Command from '../base';
import { watchFlag } from '../flags';

export default class Run extends Command {
  static description = 'Run an otto configuration';

  static flags = {
    help: Flags.help({ char: 'h' }),
    watch: watchFlag()
  };

  static args = [
    { name: 'config', description: 'config file location', required: false },
  ];

  async run() {
    const { args, flags } = await this.parse(Run);
    const filePath = args['spec-file'];

    const ottoFile = await load(filePath);
  }
}
