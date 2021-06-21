export interface Configuration {
  env: DeploymentEnv
  containers: EnvContainer[]
}

export interface EnvContainer {
  dir: string;
  envVars: EnvVar[]
}

export interface DeploymentEnv {
  name: string;
  branch: string;
}

export interface EnvVar {
  name: string; // name of the env var
  secret: string; // The name of the secret where the env var is stored
}