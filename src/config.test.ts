import { expect } from "chai";
import * as fs from "fs";
import "mocha";
import * as sinon from "sinon";
import { BlankpageConfig, IBlankConfig } from "./config";
import { ConfigurationError } from "./config-error";
let box;
let config: IBlankConfig;
describe("config.ts", () => {
  before(() => {
    box = sinon.createSandbox();
  });

  afterEach(() => {
    box.restore();
  });
  it("should throw an error if no path is provided to constructor", () => {
    expect(() => {
      config = new BlankpageConfig("");
    }).to.throw(ConfigurationError);
  });
  it("should throw if no input is defined in website.json", () => {
    box.stub(fs, "existsSync").returns(true);
    box.stub(fs, "readFileSync").returns(`{
            "title": "Website",
            "header": "My website",
            "output": "welcome"
        }`);
    expect(() => {
      config = new BlankpageConfig("hello.json");
    }).to.throw(ConfigurationError);
  });
  it("should throw if no output is defined in website.json", () => {
    box.stub(fs, "existsSync").returns(true);
    box.stub(fs, "readFileSync").returns(`{
            "title": "Website",
            "header": "My website",
            "input": "welcome"
            }`);
    expect(() => {
      config = new BlankpageConfig("hello.json");
    }).to.throw(ConfigurationError);
  });
  it("should throw if inputType is random", () => {
    box.stub(fs, "existsSync").returns(true);
    box.stub(fs, "readFileSync").returns(`{
            "title": "Website",
            "header": "My website",
            "input": "welcome",
            "output": "goodbye",
            "inputType": "email"
        }`);
    expect(() => {
      config = new BlankpageConfig("hello.json");
    }).to.throw(ConfigurationError);
  });
  it("should not throw if inputType is git", () => {
    box.stub(fs, "existsSync").returns(true);
    box.stub(fs, "readFileSync").returns(`{
            "title": "Website",
            "header": "My website",
            "input": "welcome",
            "output": "random",
            "inputType": "git"
        }`);
    expect(() => {
      config = new BlankpageConfig("hello.json");
    }).to.not.throw(ConfigurationError);
  });
});
