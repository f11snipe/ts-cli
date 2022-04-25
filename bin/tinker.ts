import fs from 'fs';
import path from 'path';

import { GithubClient, GithubFilterSort, GithubFilterDirection, IGithubRepoParams } from '../src';

const client = new GithubClient({
  token: process.env.ACCESS_TOKEN
});

const repoParams: IGithubRepoParams = {
  per_page: 1,
  owner: '5290charlie',
  repo: 'some-example-static-site'
};

const debugData = (name: string, data: any): void => {
  console.log('Debug', name, data);
  fs.writeFileSync(path.join(__dirname, '..', 'tmp', 'data', `${name}.json`), JSON.stringify(data, null, 2));
};

const tinkerRepos = async (): Promise<void> => {
  const repos = await client.repos({
    sort: GithubFilterSort.updated,
    direction: GithubFilterDirection.desc
  });

  debugData('repos', repos);
};

const tinkerRepo = async (): Promise<void> => {
  const repo = await client.repo(repoParams);

  debugData('repo', repo);
};

const tinkerUser = async (): Promise<void> => {
  const user = await client.user();

  console.log(`Debug User: ${user.id} ${user.login} - ${user.html_url}`);
  debugData('user', user);
};

const tinkerPulls = async (): Promise<void> => {
  const pulls = await client.pulls(repoParams);

  debugData('pulls', pulls);
};

const tinkerPull = async (): Promise<void> => {
  const pull = await client.pull(
    Object.assign({}, repoParams, {
      pull_number: 1
    })
  );

  debugData('pull', pull);
};

const tinkerBranches = async (): Promise<void> => {
  const branchs = await client.branches(repoParams);

  debugData('branchs', branchs);
};

const tinkerBranch = async (): Promise<void> => {
  const branch = await client.branch(
    Object.assign({}, repoParams, {
      branch: 'master'
    })
  );

  debugData('branch', branch);
};

const tinkerContents = async (): Promise<void> => {
  const files = await client.getContent(
    Object.assign({}, repoParams, {
      path: '.'
    })
  );

  debugData('files', files);

  const readme = await client.getContent(
    Object.assign({}, repoParams, {
      path: 'README.md'
    })
  );

  debugData('readme', readme);

  const pub = await client.getContent(
    Object.assign({}, repoParams, {
      path: 'public'
    })
  );

  debugData('pub', pub);
};

const tinker = async (): Promise<void> => {
  console.log('Tinker start...');

  try {
    await tinkerUser();
    // await tinkerRepos();
    await tinkerRepo();
    await tinkerBranches();
    await tinkerBranch();
    await tinkerPulls();
    await tinkerPull();
    await tinkerContents();
  } catch (err) {
    console.log('Caught Error:', err.message || err);
    console.log(JSON.stringify(err, null, 2));
  }

  console.log('Tinker end');
};

tinker();
