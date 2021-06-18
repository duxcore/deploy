import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import * as yaml from 'js-yaml';
import { Configuration, DeploymentEnv as DeploymentEnvironment } from './types';

export async function run() {
  try {
    const token = core.getInput('repo-token', { required: true });
    const configPath = core.getInput('config', { required: true });

    const client = github.getOctokit(token);
    const config = await getConfig(client, configPath);

    console.log("Testing enviornments...");
    if (!config.environments || config.environments.length == 0) throw new Error('No deployment environments were found in the configuration file...')
    await config.environments.map(async env => await validateEnv(env));
    console.log("All enviornments are valid!");

    console.log(config);

  } catch (err) {
    core.error(err as Error);
    core.setFailed((err as Error).message);
  }
}

function getConfig(client: InstanceType<typeof GitHub>, path: string): Promise<Configuration> {
  return new Promise((resolve, reject) => {
    console.log("Fetching configuration file...");
    client.rest.repos.getContent({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      path: path,
    }).then(res => {
      const raw = res.data['content'];
      const buff = Buffer.from(raw, 'base64');
      const json = JSON.parse(buff.toString('utf-8'));
      console.log("Fetched configuration file success!");
      resolve(json as Configuration);
    }).catch(err => {
      if (err.message.includes("Not Found")) return reject(new Error(`Could not find configuration file (Configured Path: ${path}).`));
      return reject(err);
    })
  });  
}

function validateEnv(env: DeploymentEnvironment): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!env.dir) return reject(new Error("Missing enviornment directory."));
    if (!env.name) return reject(new Error("Missing enviornment name."));
    if (!env.url) return reject(new Error("Missing envornment deployment server url."));

    return resolve(true);
  });
}