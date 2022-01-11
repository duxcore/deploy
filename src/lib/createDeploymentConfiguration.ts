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
    env: {},
  };

  if (config.passthroughEnv) {
    config.passthroughEnv.map(
      (k) => (depConf.env[k] = process.env[k] as string)
    );
  }

  return depConf;
}
