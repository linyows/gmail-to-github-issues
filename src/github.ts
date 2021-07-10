/**
 * Gmail to GitHub Issues
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

/**
 * Github Client
 */
export class Github {
  private config: Config

  constructor(c: Config) {
    this.config = c
    if (this.config.apiEndpoint === undefined || this.config.apiEndpoint === '') {
      this.config.apiEndpoint = 'https://api.github.com/'
    }
  }

  public get headers(): Headers {
    return {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${this.config.token}`,
    }
  }

  public createIssue(repo: string, params: NewIssueParams): Issue {
    const res = UrlFetchApp.fetch(`${this.config.apiEndpoint}repos/${repo}/issues`, {
      method: 'post' as const,
      headers: this.headers,
      payload: JSON.stringify(params),
    })
    return JSON.parse(res.getContentText())
  }

  public searchIssues(q: string): SearchIssuesResponse {
    const res = UrlFetchApp.fetch(`${this.config.apiEndpoint}search/issues`, {
      method: 'get' as const,
      headers: this.headers,
      payload: JSON.stringify({ q: encodeURIComponent(q) }),
    })
    return JSON.parse(res.getContentText())
  }
}

export type Config = {
  token: string
  apiEndpoint?: string
}

export type User = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export type Label = {
  id: number
  node_id: string
  url: string
  name: string
  color: string
  default: boolean
  description: string
}

export type Milestone = {
  url: string
  html_url: string
  labels_url: string
  id: number
  node_id: string
  number: number
  title: string
  description: string
  creator: User
  open_issues: number
  closed_issues: number
  state: string
  created_at: string
  updated_at: string
  due_on: string
  closed_at: null | string
}

export type NewIssueParams = {
  title: string
  body?: string
  assignee?: string
  milestone?: number
  labels?: string[]
  assignees?: string[]
}

export type Issue = {
  url: string
  repository_url: string
  labels_url: string
  comments_url: string
  events_url: string
  html_url: string
  id: number
  node_id: string
  number: number
  title: string
  user: User
  labels: Label[]
  state: string
  locked: boolean
  assignee: null | User
  assignees: User[]
  milestone: null | Milestone
  comments: number
  created_at: string
  updated_at: string
  author_association: string
  pull_request?: {
    url: string
    html_url: string
    diff_url: string
    patch_url: string
  }
  body: string
}

type SearchIssuesResponse = {
  total_count: number
  incomplete_results: boolean
  items: Issue[]
}

type Headers = {
  Authorization: string
  Accept: string
}
