module.exports = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'atom',
        releaseRules: [
          {
            emoji: ':bug:',
            release: 'patch',
          },
          {
            emoji: ':rocket:',
            release: 'patch',
          },
          {
            emoji: ':ambulance:',
            release: 'patch',
          },
          {
            emoji: ':art:',
            release: 'patch',
          },
          {
            emoji: ':sparkles:',
            release: 'minor',
          },
          {
            emoji: ':boom:',
            release: 'major',
          },
        ],
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'atom',
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'schemas.md', 'package.json'],
        message:
          ':bookmark: Release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
