/*
import * as core from "@actions/core";
import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import axios, { AxiosError } from "axios";
import { Configuration, DeploymentEnv as DeploymentEnvironment } from "./types";
import { DeploymentContainer, DeploymentPayload } from "./types/deployment";

export async function run() {
  try {
    const token = core.getInput("repo-token", { required: true });
    const configPath = core.getInput("config", { required: true });
    const deploymentUrl = core.getInput("deployment-url", { required: true });
    const deploymentSecret = core.getInput("deployment-secret", {
      required: true,
    });

    const client = github.getOctokit(token);
    const config = await getConfig(client, configPath);

    if (!config.env.name) throw new Error("Must define env name");
    if (!config.env.branch) throw new Error("Must define env branch");

    const envName = config.env.name;
    const branch = config.env.branch;

    if (!config.containers || config.containers.length == 0) return;

    const containers: DeploymentContainer[] = config.containers.map((c) => {
      // debug
      c.envVars.map((ev) => {
        console.log(`Fetching ${JSON.stringify(ev)}`);
        const val = core.getInput(ev.secret, { required: true });
        console.log(`Successfully fetched ${JSON.stringify(ev)}`);
      });

      const object = {
        dir: c.dir,
        envVars: c.envVars.map((ev) => {
          const secret = core.getInput(ev.secret, { required: true });
          return {
            key: ev.name,
            value: secret,
          };
        }), // NO SEMICOLON EVEN IF YOU WANT TO, ITS NOT A CALLBACK, ITS AN OBJECT
      };
      return object;
    });

    console.log("Compiling Payload...");
    const payload = createPayload(client, branch, envName, containers);
    console.log("Payload Compiled!");

    console.log("Deploying...");
    sendPayload(client, deploymentUrl, deploymentSecret, payload)
      .then((res) => {
        console.log("Deployed");
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    core.error(err as Error);
    core.setFailed((err as Error).message);
  }
}

function getConfig(
  client: InstanceType<typeof GitHub>,
  path: string
): Promise<Configuration> {
  return new Promise((resolve, reject) => {
    console.log("Fetching configuration file...");
    client.rest.repos
      .getContent({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        path: path,
      })
      .then((res) => {
        const raw = res.data["content"];
        const buff = Buffer.from(raw, "base64");
        const json = JSON.parse(buff.toString("utf-8"));
        console.log("Fetched configuration file success!");
        resolve(json as Configuration);
      })
      .catch((err) => {
        if (err.message.includes("Not Found"))
          return reject(
            new Error(
              `Could not find configuration file (Configured Path: ${path}).`
            )
          );
        return reject(err);
      });
  });
}

async function sendPayload(
  github: InstanceType<typeof GitHub>,
  url: string,
  secret: string,
  payload: DeploymentPayload
): Promise<any> {
  return axios
    .post(url, payload, {
      headers: {
        Authorization: secret,
      },
    })
    .then((res) => res.data);
}

function createPayload(
  client: InstanceType<typeof GitHub>,
  branch: string,
  envName: string,
  containers: DeploymentContainer[]
): DeploymentPayload {
  const url = `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}`;

  return {
    url,
    branch,
    envName,
    containers,
  };
}
*/
export default null;
