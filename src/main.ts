/**
 * Gmail to GitHub Issues
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

import { GmailToGithubIssues } from './gmail-to-github-issues'

const projectUrl = 'https://github.com/linyows/gmail-to-github-issue'
const g2i = new GmailToGithubIssues({
  projectUrl,
  github: {
    repo: PropertiesService.getScriptProperties().getProperty('GITHUB_REPOSITORY'),
    token: PropertiesService.getScriptProperties().getProperty('GITHUB_ACCESS_TOKEN'),
    label: PropertiesService.getScriptProperties().getProperty('GITHUB_ISSUE_LABEL'),
    apiEndpoint: PropertiesService.getScriptProperties().getProperty('GITHUB_API_ENDPOINT'),
  },
  gmail: {
    labels: PropertiesService.getScriptProperties()
      .getProperty('GMAIL_LABELS')
      .split(',')
      .map(l => l.trim()),
  },
})

/**
 * Main
 */
/* eslint @typescript-eslint/no-unused-vars: 0 */
function main() {
  g2i.run()
}
