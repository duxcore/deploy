import { Configuration } from "../types/configuration";
import { DeploymentConfiguration } from "../types/deployment";

export default function createDeploymentConfiguration(
  config: Configuration,
  serviceId: string,
  serviceSecret: string
): DeploymentConfiguration | void {
  let depConf: DeploymentConfiguration = {
    image: config.image,
    service: {
      id: serviceId,
      secret: serviceSecret,
    },
    env: (config.env ?? {}) as DeploymentConfiguration["env"],
  };

  if (config.Cmd !== undefined) depConf.commands = config.Cmd;

  if (config.passthroughEnv) {
    config.passthroughEnv.map(
      (k) => (depConf.env[k] = process.env[k] as string)
    );
  }

  if (config.exposedPorts !== undefined)
    depConf.exposedPorts = config.exposedPorts;

  return depConf;
}
