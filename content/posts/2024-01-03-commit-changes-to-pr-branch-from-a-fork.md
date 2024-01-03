---
title: Committing Changes to a Pull Request Branch Created from a Fork
date: 2024-01-03T20:00:00+02:00
type: post
authors:
  - Roald Nefs
categories:
  - Information security
  - Hardware hacking
tags:
  - featured
draft: false
featured: true
---
Sometimes a pull request on GitHub.com needs some work before it can be merged into the project but you don't want to force the required work on the pull requests original author. You're allowed to make changes to the pull request if they are opened to a repository you have push access to, the fork is user-owned, the user has granted the [required permissions](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) and there aren't any branch restrictions that will prevent committing.

1. Add an additional remote for the forked project, e.g. `git remote add roaldnefs git@github.com:roaldnefs/salt-lint.git`.

2. Fetch all branches using the `git fetch roaldnefs` command.

3. Switch to the branch in the forked project, e.g. `git checkout my-branch`.

4. You can now do anything with the branch. You can rebase it, run in locally or add new commits.

5. After you've made the necessary changes you simply push the changes using the `git push` command.

Your changes should now be reflected in the original pull request on GitHub.com.