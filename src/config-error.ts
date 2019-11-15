export class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export enum CONF_ERROR_MESSAGES {
  NO_OUTPUT_DEFINED = "No output defined in website.json (output: 'outputDir')",
  NO_INPUT_DEFINED = "No input defined in website.json (input: 'dir where text files are')",
  INVALID_INPUT_TYPE = "Invalid input type. Choose from git|fs",
  CONFIG_FILE_MISSING = "Configuration file does not exist",
}
