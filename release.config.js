module.exports = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'atom',
        releaseRules: [
          {
            //  🐛
            emoji: ':bug:',
            release: 'patch',
          },
          {
            //   🚀
            emoji: ':rocket:',
            release: 'patch',
          },
          {
            //   🚑
            emoji: ':ambulance:',
            release: 'patch',
          },
          {
            //   🎨
            emoji: ':art:',
            release: 'patch',
          },
          {
            //   ✨
            emoji: ':sparkles:',
            release: 'minor',
          },
          {
            //   💥
            emoji: ':boom:',
            release: 'major',
          },
        ],
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [],
      },
    ],
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
        assets: ['CHANGELOG.md'],
        message:
          ':bookmark: Release ${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],
  ],
};