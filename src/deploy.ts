import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import * as yaml from 'js-yaml';
import { Configuration } from './types';

export async function run() {
  try {
    const token = core.getInput('repo-token', { required: true });
    const client = github.getOctokit(token);

    const config = getConfig(client);

    console.log(config);

  } catch (err) {
    core.error(err as Error);
    core.setFailed((err as Error).message);
  }
}

async function getConfig(client: InstanceType<typeof GitHub>): Promise<Configuration> {
  const config = await client.rest.repos.getContent({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    path: ".deployer.json"
  });
  
  return JSON.parse(config.data.toString()) as Configuration;
}