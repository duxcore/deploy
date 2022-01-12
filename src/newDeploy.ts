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

    const apiBearer = core.getInput("api-bearer", { required: true });
    const apiSecret = core.getInput("api-secret", { required: true });

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

    await axios
      .post(deploymentUrl, deploymentConfig, {
        headers: {
          bearer: apiBearer,
          authorization: apiSecret,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err: AxiosError) => {
        const data = err.response?.data;

        if (!data.meta.timestamp)
          return core.setFailed(`${err.code} | ${err.message}`);
        return core.setFailed(data.message);
      });

    return;
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}
