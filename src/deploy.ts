import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import * as yaml from 'js-yaml';
import { Configuration, DeploymentEnv as DeploymentEnvironment } from './types';
import { DeploymentContainer, DeploymentPayload } from './types/DeploymentPayload';

export async function run() {
  try {
    const token = core.getInput('repo-token', { required: true });
    const configPath = core.getInput('config', { required: true });

    const client = github.getOctokit(token);
    const config = await getConfig(client, configPath);

    if (!config.env.name) throw new Error("Must define env name");
    if (!config.env.branch) throw new Error("Must define env branch");

    const envName = config.env.name;
    const branch = config.env.branch;

    if (!config.containers || config.containers.length == 0) return;

    const containers: DeploymentContainer[] = config.containers.map(c => {
      return {
        dir: c.dir,
        envVars: c.envVars.map(ev => {
          const secret = core.getInput(ev.secret, { required: true });
          return {
            key: ev.name,
            value: secret
          }
        })
      };
    });

    const payload = createPayload(client, branch, envName, containers);

    console.log(JSON.stringify(payload, null, 2));

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

function createPayload(
  client: InstanceType<typeof GitHub>, 
  branch: string, 
  envName: string, 
  containers: DeploymentContainer[]
  ): DeploymentPayload {

    const url = github.context.repo.repo;

    return {
      url,
      branch,
      envName,
      containers
    }
}