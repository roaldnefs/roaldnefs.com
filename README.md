# roaldnefs.com

Personal site for [Roald Nefs](https://github.com/roaldnefs), using the very fast and flexible static site generator called Hugo.

## Getting Started

Start by cloning the repository:

```console
git clone git@github.com:roaldnefs/roaldnefs.com.git
cd roaldnefs.com
```

Check out the `gh-pages` branch into the `public` folder using git's [worktree feature](https://git-scm.com/docs/git-worktree). Essentially, the worktree allows you to have multiple branches on the same local repoistory to be checked out in different directories:

```console
git worktree add -B gh-pages public origin/gh-pages
```

Regenerate the site using the `hugo` command and commit the generated files on the `gh-pages` branch:

```console
hugo
cd public
git add --all
git commit -sm "Publishing to gh-pages"
```

If the changes on the local `gh-pages` branch look alright, push them to the remote repo:

```
git push origin gh-pages
```

