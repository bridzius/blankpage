import { execSync } from "child_process";
import { statSync } from "fs";
export const getFSDate = (filePath: string): number => {
    return statSync(filePath).mtime.getTime();
};

export const getGitDate = (filePath: string): number => {
    const errorMessage = `No git date for ${filePath}. Have you comitted the file?`
    const gitDate = execSync(`git log --format="%at" -- ${filePath}`);
    const date = parseInt(gitDate.toString(), 10);
    if (isNaN(date)) {
	    throw new Error(errorMessage);
	    return 0;
    }
    // git log returns UNIX timestamp in seconds. Javascript uses it in milliseconds.
    return date * 1000;
};
