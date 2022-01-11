import * as core from "@actions/core";
import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import axios, { AxiosError } from "axios";
import fetchConfig from "./lib/fetchConfig";

export async function run() {
  try {
    const configPath = core.getInput("config", { required: false });

    const client = github.getOctokit(process.env.GITHUB_TOKEN as string);
    const config = await fetchConfig(client, configPath);

    console.log(config);

    return;
  } catch (err) {
    core.error(err as Error);
    core.setFailed((err as Error).message);
  }
}
