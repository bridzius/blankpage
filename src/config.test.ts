import {
    expect,
} from "chai";
import * as fs from "fs";
import "mocha";
import {
    sandbox,
} from "sinon";
import Config from "./config";
import ConfigurationError from "./config-error";
let box;
let config;
describe("config.ts", () => {

    before(() => {
        box = sandbox.create();
    });

    afterEach(() => {
        box.restore();
    });
    it("should throw an error if no path is provided to constructor", () => {
        expect(() => {
            config = new Config("");
        }).to.throw(ConfigurationError);
    });
    it("should throw if no input is defined in website.json", () => {
        box.stub(fs, "existsSync").returns(true);
        box.stub(fs, "readFileSync").returns(`{"title": "Website", "header": "My website", "output": "welcome"}`);
        expect(() => {
            config = new Config("hello.json");
        }).to.throw(ConfigurationError);
    });
    it("should throw if no output is defined in website.json", () => {
        box.stub(fs, "existsSync").returns(true);
        box.stub(fs, "readFileSync").returns(`{"title": "Website", "header": "My website", "input": "welcome"}`);
        expect(() => {
            config = new Config("hello.json");
        }).to.throw(ConfigurationError);
    });
});
