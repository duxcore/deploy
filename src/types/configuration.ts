export interface Configuration {
  image: string;
  Cmd?: string[];
  exposedPorts?: {
    [port: string]: string;
  };
  env?: {
    [name: string]: string;
  }[];
  passthroughEnv?: string[];
}
