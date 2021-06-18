export interface Configuration {
  environments: DeploymentEnv[]
}

export interface DeploymentEnv {
  url: string; // The URL that points to the deployment server
  name: string; // Name of the deployment environment
  dir: string; // The directory of the environment 
}