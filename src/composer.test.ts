import {
    expect,
} from "chai";
import * as fs from "fs";
import "mocha";
import * as process from "process";
import {
    sandbox,
} from "sinon";
import blankpage from "./composer";
import ConfigurationError from "./config-error";
let box;

describe("blankpage", () => {

    before(() => {
        box = sandbox.create();
    });

    afterEach(() => {
        box.restore();
    });
    it("should throw if no website.json provided", () => {
        expect(blankpage.bind(blankpage)).to.throw();
    });
    it("should throw if no input is defined in website.json", () => {
        const origArgv = Array.from(process.argv);
        Object.defineProperty(process, "argv", {value: ["", "", "hello.json"]});
        box.stub(fs, "existsSync").returns(true);
        box.stub(fs, "readFileSync").returns(`{"title": "Website", "header": "My website", "output": "welcome"}`);
        expect(blankpage.bind(blankpage)).to.throw(ConfigurationError);
        Object.defineProperty(process, "argv", origArgv);
    });
    it("should throw if no output is defined in website.json", () => {
        const origArgv = Array.from(process.argv);
        Object.defineProperty(process, "argv", {value: ["", "", "hello.json"]});
        box.stub(fs, "existsSync").returns(true);
        box.stub(fs, "readFileSync").returns(`{"title": "Website", "header": "My website", "input": "welcome"}`);
        expect(blankpage.bind(blankpage)).to.throw(ConfigurationError);
        Object.defineProperty(process, "argv", {value: origArgv});
    });
});
