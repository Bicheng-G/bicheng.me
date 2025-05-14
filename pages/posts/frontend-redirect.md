---
title: A Simple Approach For Redirects
date: 2025-05-14T16:00:00.000+08:00
lang: en
duration: 2min
type: note
---

In the event if you have 2 independent projects - a main site and a intro site (that has a button link to main site) - and you want to use the intro page for the main site. For example:

`bicheng.me` as the main site
`gu.bicheng.me` as the intro page

The goal for the intro page is: whenever a user visits main site, check if they have seen the intro page. If yes, display the content as per normal, if no redirect to the intro site.

There's a brilliant implementation solely based on frontend logic without needing you to rerouting in backend nor changing DNS record.

The key logic to acheive is by adding a parameter and a checking logic to the traffic from the intro site and the main site respectively.

Below is the sample script for the logic:

<!-- eslint-skip -->

```javascript
<script>
;(function () {
    const KEY = 'seenIntro'
    const params = new URLSearchParams(window.location.search)

    // 1. If URL contains 'intro=1' parameter, do not redirect, and clear the parameter for cleanness
    if (params.get('intro') === '1') {
    sessionStorage.setItem(KEY, 'true') // use sessionStorage if you want logic valid only for the life span of a tab
    history.replaceState(null, '', window.location.pathname + window.location.hash) // keeps hash
    return
    }

    // 2. If no parameter in the URL, redirect to the intro page
    if (!sessionStorage.getItem(KEY) && window.location.pathname === '/') {
    location.replace('https://gu.bicheng.me')
    }
})()
</script>
```

Don't forget to edit the `href` in the intro site to include the parameter. For instance, `https://bicheng.me/?intro=1`.

To prevent the flickering during redirect, it is recommended to add this script as high above as possible to the `<head> `section of the main site.

You can choose the desired duration to reset the `seenIntro` status between per tab or permanent (unless user manually clears browsing caches). It is differenciated by using `sessionStorage` and `localStorage` respectively. Since my goal is to show intro page whenever a user visits my main site, I am using the former.

Another good thing about this approach is that it will not be labeled as insecure site by the browser, due to following reasons:

1. Both sites are HTTPS -> As long as the redirect is with in TLS encrypted tunnel, it will not trigger "Mixed Content" or "insecure" Warning.
2. JavaScript redirect is not considered as suspicious script -> thus will not be marked as "malicious redirects".
3. sessionStorage only works locally -> not exposed to external server, hence do not pose privacy risks.
