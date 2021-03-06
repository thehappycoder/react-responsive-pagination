const { execSync } = require('child_process');

module.exports = isDryRun() ? getDryRunConfig() : getNormalConfig();

function getDryRunConfig() {
  return {
    repositoryUrl: getLocalRepoUrl(),
    branches: getCurrentBranch(),
    plugins: [
      ['@semantic-release/commit-analyzer', getCommitAnalyzerConfig()],
      '@semantic-release/release-notes-generator',
    ],
  };
}

function getNormalConfig() {
  return {
    plugins: [
      ['@semantic-release/commit-analyzer', getCommitAnalyzerConfig()],
      '@semantic-release/release-notes-generator',
      [
        '@semantic-release/changelog',
        {
          changelogTitle: '# React Responsive Pagination Changelog',
        },
      ],
      '@semantic-release/npm',
      '@semantic-release/github',
      [
        '@semantic-release/git',
        {
          assets: ['CHANGELOG.md', 'package.json'],
        },
      ],
    ],
  };
}

function getCommitAnalyzerConfig() {
  return {
    preset: 'angular',
    releaseRules: [{ type: 'docs', release: 'patch' }],
  };
}

function isDryRun() {
  return process.argv.includes('--dry-run');
}

function getLocalRepoUrl() {
  const topLevelDir = execSync('git rev-parse --show-toplevel')
    .toString()
    .trim();

  return `file://${topLevelDir}/.git`;
}

function getCurrentBranch() {
  return execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();
}
