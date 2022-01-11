import { Configuration } from "../types/configuration";

export default function validateConfig(config: Configuration): true | Error {
  /**
   * Validate "image"
   */
  if (typeof config.image !== "string")
    return new Error(`Value "image" must be an instance of a string`);

  if (!config.image)
    return new Error(`Value "image" missing from configuration file.`);

  /**
   * Validate "Cmd"
   */

  if (config.Cmd) {
    if (typeof config.Cmd !== "object")
      return new Error("Cmd value in configuration must be an array.");

    if (config.Cmd.map((v) => typeof v == "string").includes(false))
      return new Error(
        "Cmd value in configuration file must only include strings in array"
      );
  }

  /**
   * Validate env vars
   */
  if (config.env !== undefined) {
    if (typeof config.env !== "object")
      return new Error(
        "Enviornment varibles must be an object of keys and values."
      );
    if (
      Object.keys(config.env)
        .map(
          (v) =>
            config.env && !!config.env[v] && typeof config.env[v] == "string"
        )
        .includes(false)
    )
      return new Error("All env values must be an instance of a string.");
  }

  /**
   * Validate passthrough env
   */
  if (config.passthroughEnv !== undefined) {
    if (typeof config.passthroughEnv !== "object")
      return new Error(
        "Passthrough env must be a string of env varible names."
      );
  }

  /**
   * Validate Exposed Ports
   */
  if (config.exposedPorts !== undefined) {
    if (typeof config.exposedPorts !== "object")
      return new Error("Exposed ports must be an object of keys and values.");

    if (
      Object.keys(config.exposedPorts)
        .map<any>((v) => (config.exposedPorts ?? {})[v])
        .includes(null)
    )
      return new Error("Exposed port cannot be null");

    if (
      Object.keys(config.exposedPorts)
        .map(
          (v) =>
            config.exposedPorts &&
            typeof parseInt(config.exposedPorts[v].toString()) == "number"
        )
        .includes(false)
    )
      return new Error(
        "All exposed ports must be strings of numbers or numbers."
      );
  }

  return true;
}
