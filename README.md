# Packages Changelog

## Steps

1. generate 'updates.txt' file using npm-check-updates library
2. parse 'updates.txt' file and get outdated packages info (Github URL, name, current and latest versions)
3. make a JSON file with parsed data
4. launch a Vue app that list all categories and packages in format of dropdown item from JSON file
5. upon opening dropdown item fetch package versions comparison from GitHub API (for example, Next.js v13 -> v14)
6. display data as a list providing links to the origin source

```js
const response = await fetch(
  `https://api.github.com/repos/${owner}/${repo}/compare/${currentVersion}...${latestVersion}`,
  {
    headers: {
      Accept: "application/json",
    },
  }
);

// ...

return {
  total_commits: data.total_commits,
  commits: data.commits.map((commit) => ({
    message: commit.commit.message,
    date: commit.commit.author.date,
    html_url: commit.html_url,
  })),
};
```
