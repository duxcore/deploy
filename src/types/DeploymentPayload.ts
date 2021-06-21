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
  containers: DeploymentContainer[]
}