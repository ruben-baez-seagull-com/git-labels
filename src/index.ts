import {
    setOutput,
    setFailed,
    getInput,
    warning as logWarning,
} from '@actions/core';

import {
    GitHub,
    context,
} from "@actions/github";

async function run() {
    const token = getInput("github-token", { required: true });
    const sha = getInput("commit-sha", { required: true });
    const client = new GitHub(token);

    const labelNames = await getLabels(client, sha);

    setOutput("result", labelNames);
}

async function getLabels(
    client: GitHub,
    sha: string
): Promise<string[]> {
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const commit_sha = sha;

    const response = await client.repos.listPullRequestsAssociatedWithCommit({
        owner,
        repo,
        commit_sha,
    });

    const pr = response.data.length > 0 && response.data[0];
    return pr ? pr.labels.map((label) => label.name) : [];
}

run().catch((err) => {
    setFailed(err.message);
});