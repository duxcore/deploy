export interface DeploymentEnvVar {
  key: string;
  value: string;
}

export interface DeploymentContainer {
  dir: string;
  envVars: DeploymentEnvVar[];
}

export interface DeploymentPayload {
  url: string;
  branch: string;
  envName: string;
  containers: DeploymentContainer[];
}

export interface DeploymentConfiguration {
  service: {
    id: string;
    secret: string;
  };
  image: string;
  commands: string[];
  env?: {
    [name: string]: string;
  };
  exposedPorts?: {
    [port: string]: string;
  };
}
