import * as core from "@actions/core";
import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import axios, { AxiosError } from "axios";
import fetchConfig from "./lib/fetchConfig";
import validateConfig from "./lib/validateConfig";

export async function run() {
  try {
    const configPath = core.getInput("config", { required: false });

    const client = github.getOctokit(process.env.GITHUB_TOKEN as string);
    const config = await fetchConfig(client, github, configPath);
    const configValid = validateConfig(config);

    if (configValid !== true) throw configValid;

    console.log(config);

    return;
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}
