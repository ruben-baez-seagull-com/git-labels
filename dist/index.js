"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = core_1.getInput("github-token", { required: true });
        const client = new github_1.GitHub(token);
        const labelNames = yield getLabels(client);
        core_1.setOutput("result", labelNames);
    });
}
function getLabels(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const owner = github_1.context.repo.owner;
        const repo = github_1.context.repo.repo;
        const commit_sha = github_1.context.sha;
        const response = yield client.repos.listPullRequestsAssociatedWithCommit({
            owner,
            repo,
            commit_sha,
        });
        const pr = response.data.length > 0 && response.data[0];
        return pr ? pr.labels.map((label) => label.name) : [];
    });
}
run().catch((err) => {
    core_1.setFailed(err.message);
});
