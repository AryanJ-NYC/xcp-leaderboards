# XCP Leaderboards

## Pre-Requisites

1. Netlify CLI

## Adding a New Project

To add a new project, go into the DB and add the project row in the `Projects` table. From there, run the sync function.

## Running Sync Functions

1. `netlify functions:serve`
2. `netlify functions:invoke sync-<project-name> --port 9999`
