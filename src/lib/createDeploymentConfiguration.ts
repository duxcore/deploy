import { Configuration } from "../types/configuration";
import { DeploymentConfiguration } from "../types/deployment";

export default function createDeploymentConfiguration(
  config: Configuration,
  serviceId: string,
  serviceSecret: string
): DeploymentConfiguration | void {
  return {
    image: config.image,
    service: {
      id: serviceId,
      secret: serviceSecret,
    },
  };
}
