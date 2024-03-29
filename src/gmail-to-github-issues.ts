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
  private threads: GoogleAppsScript.Gmail.GmailThread[]
  private gmailMessages: GoogleAppsScript.Gmail.GmailMessage[]
  static ISSUED_LABEL = 'issued'

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
    this.threads = []
  }

  public run(): void {
    this.fetchMails()
    this.createIssues()
    let label = GmailApp.getUserLabelByName(GmailToGithubIssues.ISSUED_LABEL)
    if (0 === Object.keys(label).length) {
      label = GmailApp.createLabel(GmailToGithubIssues.ISSUED_LABEL)
    }
    label.addToThreads(this.threads)
    GmailApp.markMessagesRead(this.gmailMessages)
  }

  public fetchMails(): void {
    const start = 0
    const max = this.config.gmail.max ? this.config.gmail.max : 20
    const conditions = this.config.gmail.searchConditions ? this.config.gmail.searchConditions : `-{label:${GmailToGithubIssues.ISSUED_LABEL}} newer_than:3d`

    for (const label of this.config.gmail.labels) {
      const threads = GmailApp.search(`label:${label} ${conditions}`, start, max)
      this.threads = this.threads.concat(threads)
      console.log(`${label}: ${threads.length}`)

      for (const t of threads) {
        const msg = t.getMessages().pop()
        const from = msg.getFrom()
        // ignore own replies
        const ignore = this.config.domainsToIgnore.find(d => from.includes(d))
        if (ignore !== undefined) {
          console.log(`ignored ${from}`)
          continue
        }
        const id = msg.getId()
        const labels = t.getLabels().map(l => l.getName())
        this.gmailMessages.push(msg)
        this.mails.push({
          id,
          labels,
          subject: msg.getSubject(),
          date: msg.getDate(),
          to: msg.getTo(),
          from,
          body: msg.getBody(),
        })
      }
    }
  }

  public defaultTemplate(m: Mail): string {
    return `:mailbox_with_mail: Received this email:

~~~
ID: ${m.id}
Date: ${m.date.toString()}
From: ${m.from}
To: ${m.to}
Subject: ${m.subject}
Body:

${m.body}
~~~

:octocat: Posted by [Gmail to GitHub Issues](${this.config.projectUrl})
`
  }

  public isDuplicated(messageId: string): boolean {
    const result = this.github.searchIssues(`${messageId}+is:issue+repo:${this.config.github.repo}`)
    return result.total_count > 0
  }

  public createIssues(): void {
    for (const mail of this.mails) {
      if (this.isDuplicated(mail.id)) {
        continue
      }
      const labels = []
      for (const l of mail.labels) {
        if (l !== GmailToGithubIssues.ISSUED_LABEL) {
          labels.push(l)
        }
      }
      if (this.config.github.label !== undefined && this.config.github.label !== '') {
        labels.push(this.config.github.label)
      }

      this.github.createIssue(this.config.github.repo, {
        title: `${mail.subject.substr(0, 200)}${mail.subject.length > 200 ? '...' : ''}`, // maximum is 256 character
        body: this.config.github.template ? this.config.github.template(mail) : this.defaultTemplate(mail),
        labels,
      })
    }
  }
}

type Mail = {
  id: string
  labels: string[]
  subject: string
  date: GoogleAppsScript.Base.Date
  to: string
  from: string
  body: string
}

type IssueTemplate = (m: Mail) => string

type GithubConfig = {
  repo: string
  token: string
  label?: string
  apiEndpoint?: string
  template?: IssueTemplate
}

type GmailConfig = {
  labels: string[]
  searchConditions?: string
  max?: number
}

type Config = {
  projectUrl: string
  github: GithubConfig
  gmail: GmailConfig
  domainsToIgnore: string[]
}
