import * as core from "@actions/core";
import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import axios, { AxiosError } from "axios";
import createDeploymentConfiguration from "./lib/createDeploymentConfiguration";
import fetchConfig from "./lib/fetchConfig";
import validateConfig from "./lib/validateConfig";

export async function run() {
  try {
    const configPath = core.getInput("config", { required: false });
    const serviceId = core.getInput("service-id", { required: true });
    const serviceSecret = core.getInput("service-secret", { required: true });
    const deploymentUrl = core.getInput("deployment-url", { required: true });

    const client = github.getOctokit(process.env.GITHUB_TOKEN as string);
    const config = await fetchConfig(client, github, configPath);
    const configValid = validateConfig(config);

    if (configValid !== true) throw configValid;

    const deploymentConfig = createDeploymentConfiguration(
      config,
      serviceId,
      serviceSecret
    );

    console.log(config);
    console.log(deploymentConfig);

    return;
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}
