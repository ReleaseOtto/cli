import path from 'path';
import { test } from '@oclif/test';
import { NO_CONTEXTS_SAVED } from '../../src/errors/ContextError';
import TestHelper from '../TestHelper';

const testHelper = new TestHelper();

describe('run', () => {
  describe('with file paths', () => {
    beforeEach(() => {
      testHelper.createDummyContextFile();
    });

    afterEach(() => {
      testHelper.deleteDummyContextFile();
    });

    test
      .stderr()
      .stdout()
      .command(['validate', './test/specification.yml'])
      .it('works when file path is passed', (ctx, done) => {
        expect(ctx.stdout).toMatch('File ./test/specification.yml is valid but has (itself and/or referenced documents) governance issues.\n\ntest/specification.yml');
        expect(ctx.stderr).toEqual('');
        done();
      });

    test
      .stderr()
      .stdout()
      .command(['validate', './test/specification-avro.yml'])
      .it('works when file path is passed and schema is avro', (ctx, done) => {
        expect(ctx.stdout).toMatch(
          'File ./test/specification-avro.yml is valid but has (itself and/or referenced documents) governance issues.\n'
        );
        expect(ctx.stderr).toEqual('');
        done();
      });

    test
      .stderr()
      .stdout()
      .command(['validate', './test/not-found.yml'])
      .it('should throw error if file path is wrong', (ctx, done) => {
        expect(ctx.stdout).toEqual('');
        expect(ctx.stderr).toEqual('error loading AsyncAPI document from file: ./test/not-found.yml file does not exist.\n');
        done();
      });

    test
      .stderr()
      .stdout()
      .command(['validate', 'https://bit.ly/asyncapi'])
      .it('works when url is passed', (ctx, done) => {
        expect(ctx.stdout).toMatch('URL https://bit.ly/asyncapi is valid but has (itself and/or referenced documents) governance issues.\n\nhttps://bit.ly/asyncapi');
        expect(ctx.stderr).toEqual('');
        done();
      });

    test
      .stderr()
      .stdout()
      .command(['validate', './test/valid-specification.yml'])
      .it('works when file path is passed', (ctx, done) => {
        expect(ctx.stdout).toMatch('File ./test/valid-specification.yml is valid! File ./test/valid-specification.yml and referenced documents don\'t have governance issues.');
        expect(ctx.stderr).toEqual('');
        done();
      });
  });
});
