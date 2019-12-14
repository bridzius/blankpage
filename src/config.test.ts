import * as fs from "fs";
import { BlankpageConfig, IBlankConfig } from "./config";
import { ConfigurationError } from "./config-error";
describe("config.ts", () => {
  it("should throw an error if no path is provided to constructor", () => {
    expect(() => {
      new BlankpageConfig("");
    }).toThrow(ConfigurationError);
  });
  it("should throw if no input is defined in website.json", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(`{
            "title": "Website",
            "header": "My website",
            "output": "welcome"
        }`);
    expect(() => {
      new BlankpageConfig("hello.json");
    }).toThrow(ConfigurationError);
  });
  it("should throw if no output is defined in website.json", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(`{
            "title": "Website",
            "header": "My website",
            "input": "welcome"
            }`);
    expect(() => {
      new BlankpageConfig("hello.json");
    }).toThrow(ConfigurationError);
  });
  it("should throw if inputType is random", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(`{
            "title": "Website",
            "header": "My website",
            "input": "welcome",
            "output": "goodbye",
            "inputType": "email"
        }`);
    expect(() => {
      new BlankpageConfig("hello.json");
    }).toThrow(ConfigurationError);
  });
  it("should not throw if inputType is git", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(`{
            "title": "Website",
            "header": "My website",
            "input": "welcome",
            "output": "random",
            "inputType": "git"
        }`);
    expect(() => {
      new BlankpageConfig("hello.json");
    }).not.toThrow(ConfigurationError);
  });
});
