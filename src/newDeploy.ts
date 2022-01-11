import * as core from "@actions/core";
import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import axios, { AxiosError } from "axios";

export function run() {
  const client = github.getOctokit(process.env.GITHUB_TOKEN as string);

  console.log(process.env.TEST);

  return;
}
