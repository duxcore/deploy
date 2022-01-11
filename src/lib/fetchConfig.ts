import { GitHub } from "@actions/github/lib/utils";
import github from "@actions/github";
import { Configuration } from "../types/configuration";

export default function fetchConfig(
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
