/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const repoUrl = 'https://github.com/urban-bot/urban-bot';

const siteConfig = {
    title: 'Urban Bot', // Title for your website.
    tagline: 'The universal chatbot library based on React.',
    url: 'https://urban-bot.now.sh', // Your website URL
    baseUrl: '/', // Base URL for your project */
    // For github.io type URLs, you would set the url and baseUrl like:
    //   url: 'https://facebook.github.io',
    //   baseUrl: '/test-site/',

    // Used for publishing and more
    projectName: 'urban-bot',
    organizationName: 'urban-bot',
    // For top-level user or org sites, the organization is still the same.
    // e.g., for the https://JoelMarcey.github.io site, it would be set like...
    //   organizationName: 'JoelMarcey'

    // For no header links in the top nav bar -> headerLinks: [],
    headerLinks: [
        { doc: 'components', label: 'Docs' },
        {
            href: repoUrl,
            label: 'GitHub',
        },
    ],

    // If you have users set above, you add it here:
    // users,

    /* path to images for header/footer */
    // headerIcon: 'img/favicon.ico',
    // footerIcon: 'img/favicon.ico',
    favicon: 'img/favicon/favicon.ico',

    /* Colors for website */
    colors: {
        primaryColor: '#422085',
        secondaryColor: '#442f6c',
    },

    /* Custom fonts for website */
    /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

    // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
    copyright: `Copyright © ${new Date().getFullYear()} German Smirnov and Ivan Pakhotin`,

    highlight: {
        // Highlight.js theme to use for syntax highlighting in code blocks.
        theme: 'atom-one-dark',
    },
    usePrism: ['jsx'],

    // On page navigation for the current documentation page.
    onPageNav: 'separate',
    // No .html extensions for paths.
    cleanUrl: true,

    // Open Graph and Twitter card images.
    ogImage: 'img/undraw_online.svg',
    twitterImage: 'img/undraw_tweetstorm.svg',

    // For sites with a sizable amount of content, set collapsible to true.
    // Expand/collapse the links and subcategories under categories.
    // docsSideNavCollapsible: true,

    // Show documentation's last contributor's name.
    // enableUpdateBy: true,

    // Show documentation's last update time.
    // enableUpdateTime: true,

    // You may provide arbitrary config keys to be used as needed by your
    // template. For example, if you need your repo's URL...
    repoUrl,

    scrollToTop: true,
    customDocsPath: path.basename(__dirname) + '/docs',

    scripts: [
        'https://buttons.github.io/buttons.js',
        'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
        '/js/code-block-buttons.js',
    ],
    stylesheets: ['/css/code-block-buttons.css', 'https://fonts.googleapis.com/css2?family=Londrina+Shadow&display=swap']
};

module.exports = siteConfig;
