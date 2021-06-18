import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import * as yaml from 'js-yaml';
import { Configuration } from './types';

export async function run() {
  try {
    const token = core.getInput('repo-token', { required: true });
    const configPath = core.getInput('config', { required: true });

    const client = github.getOctokit(token);

    const config = await getConfig(client, configPath);

    console.log(config);

  } catch (err) {
    core.error(err as Error);
    core.setFailed((err as Error).message);
  }
}

function getConfig(client: InstanceType<typeof GitHub>, path: string): Promise<Configuration> {
  return new Promise((resolve, reject) => {
    client.rest.repos.getContent({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      path: path
    }).then(res => {
      const json = JSON.parse(res.data.toString())
    }).catch(err => {
      if (err.message.includes("Not Found")) return reject(new Error('Could not find configuration file.'));
      return reject(err);
    })
  });  
}