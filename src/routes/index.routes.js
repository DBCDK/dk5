/**
 * @file
 * Define the base routes
 */

// Libraries
const Router = require('koa-router');

// Init router
const router = new Router();

// Routes
router.get('/', ctx => {
  const proClass = ctx.pro ? 'main pro' : 'main';
  let cookieBotScript;
  if (ctx.pro) {
   cookieBotScript =
     '<script type="text/javascript"' +
       ' id="CookieDeclaration"' +
       ' src="https://consent.cookiebot.com/f98c204a-ce93-4888-9257-53627ca0a361/cd.js"' +
       ' async>' +
     '</script>';
  }
  else {
    cookieBotScript =
      '<script type="text/javascript"' +
        ' id="Cookiebot" ' +
        ' src="https://consent.cookiebot.com/uc.js" ' +
        ' data-cbid="f98c204a-ce93-4888-9257-53627ca0a361" ' +
        ' data-blockingmode="auto">' +
      '</script>';
  }
  const matomoScript = `<!--Matomo -->
<script type="text/javascript">
  var _paq = window._paq || [];
  _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
  _paq.push(['requireCookieConsent']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="https://stats.dbc.dk/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '${ctx.pro ? '28' : '27'}']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
  </script>
<!-- End Matomo -->`;


  ctx.body = `
    <!DOCTYPE html>
    <html lang="da">
      <head>
        <title>DK5</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${ctx.test ? '' : cookieBotScript}
        <link rel="stylesheet" type="text/css" href="/css/main.css"/>
      </head>
      <body>
        <div class="${proClass}">
          <div id="content"></div>
          <script>window.PRO = ${ctx.pro}</script>
          <script>window.TEST = ${ctx.test}</script>
          <script src="/js/main.js"></script>
        </div>
        ${ctx.test ? '' : matomoScript}
      </body>
    </html>
  `;
});

module.exports = {
  router
};
