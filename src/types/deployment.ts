export interface DeploymentConfiguration {
  service: {
    id: string;
    secret: string;
  };
  image: string;
  commands?: string[];
  env?: {
    [name: string]: string;
  };
  exposedPorts?: {
    [port: string]: string;
  };
}
