/**
 * Gmail to GitHub Issues
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

import { Github } from './github'

export class GmailToGithubIssues {
  private gh: Github
  private config: Config
  private mails: Mail[]
  private gmailMessages: GoogleAppsScript.Gmail.GmailMessage[]

  private get github(): Github {
    if (this.gh === undefined) {
      this.gh = new Github(this.config.github)
    }
    return this.gh
  }

  constructor(c: Config) {
    this.config = c
    this.mails = []
    this.gmailMessages = []
  }

  public run(): void {
    this.fetchMails()
    this.createIssues()
    GmailApp.markMessagesRead(this.gmailMessages)
  }

  public fetchMails(): void {
    const start = 0
    const max = 20

    for (const label of this.config.gmail.labels) {
      const thread = GmailApp.search(`label:${label} is:unread newer_than:7d`, start, max)
      console.log(`${label}: ${thread.length}`)

      for (const m of thread) {
        const id = m.getId()
        const msg = GmailApp.getMessageById(id)
        this.gmailMessages.push(msg)
        this.mails.push({
          id,
          label,
          subject: msg.getSubject(),
          date: msg.getDate(),
          to: msg.getTo(),
          from: msg.getFrom(),
          body: msg.getBody(),
        })
      }
    }
  }

  public createIssues(): void {
    for (const mail of this.mails) {
      const labels = [mail.label]
      if (this.config.github.label !== undefined && this.config.github.label !== '') {
        labels.push(this.config.github.label)
      }

      this.github.createIssue(this.config.github.repo, {
        title: mail.subject,
        body: `:mailbox_with_mail: Received this email:

~~~
ID: ${mail.id}
Date: ${mail.date.toString()}
From: ${mail.from}
To: ${mail.to}
Subject: ${mail.subject}
Body:

${mail.body}
~~~

:octocat: ${this.config.projectUrl}
`,
        labels,
      })
    }
  }
}

type Mail = {
  id: string
  label: string
  subject: string
  date: GoogleAppsScript.Base.Date
  to: string
  from: string
  body: string
}

type GithubConfig = {
  repo: string
  token: string
  label?: string
  apiEndpoint?: string
}

type GmailConfig = {
  labels: string[]
}

type Config = {
  projectUrl: string
  github: GithubConfig
  gmail: GmailConfig
}
