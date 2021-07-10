<p align="center"><br><br><br><br>
📧 👉 :octocat:<br>
<b>Gmail to GitHub Issues</b>
</p>

<p align="center">
This creates Github issues from an unread mail with the specified label on GAS.<br>
<a href="https://github.com/linyows/gmail-to-github-issues/actions" title="actions"><img src="https://img.shields.io/github/workflow/status/linyows/gmail-to-github-issues/Build?style=for-the-badge"></a>
<a href="https://github.com/google/clasp" title="clasp"><img src="https://img.shields.io/badge/built%20with-clasp-4285f4.svg?style=for-the-badge"></a>
<a href="https://github.com/linyows/gmail-to-github-issues/blob/main/LICENSE" title="MIT License"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge"></a>
</p> <br><br><br><br>

Usage
-----

1. Deploy this
    ```sh
    $ npm i
    $ npx clasp login
    $ npx clasp create 'Gmail to GitHub Issues' --rootDir ./src
    $ npx clasp push
    ```
1. Set script properties as ENV(File > Project properties > Script properties)
    - GMAIL_LABELS
    - GITHUB_ACCESS_TOKEN
    - GITHUB_REPOSITORY
    - GITHUB_ISSUE_LABEL(optional)
    - GITHUB_API_ENDPOINT(optional)
1. Add project trigger(Edit > Current project's triggers > Add trigger)
    - Choose which function to run: `notify`
    - Which run at deployment: `head`
    - Select event source: `Time-driven`
    - Select type of time based trigger: `Minute timer`
    - Select hour interval: `Every minute`

Contribution
------------

1. Fork (https://github.com/linyows/gmail-to-github-issues/fork)
1. Create a feature branch
1. Commit your changes
1. Rebase your local changes against the main branch
1. Run test suite with the `npm ci` command and confirm that it passes
1. Create a new Pull Request

Author
------

[linyows](https://github.com/linyows)
