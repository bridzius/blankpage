export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export enum ConfigurationErrorMessages {
  NoOutputDefined = "No output defined in website.json (output: 'outputDir')",
  NoInputDefined = "No input defined in website.json (input: 'dir where text files are')",
  InvalidInputType = "Invalid input type. Choose from git|fs",
  ConfigFileMissing = "Configuration file does not exist"
}
