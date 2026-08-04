<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/rss/channel">
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title><xsl:value-of select="title"/></title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  body { background:#EFE9DC; color:#2B2520; font-family:sans-serif; margin:0; padding:0; line-height:1.6; }
  .wrap { max-width:680px; margin:0 auto; padding:3rem 1.5rem 4rem; }
  .eyebrow { font-family:monospace; font-size:0.72rem; letter-spacing:0.12em; color:#6B7A5E; text-transform:uppercase; margin:0 0 0.5rem; }
  h1 { font-family:Georgia,serif; font-size:2rem; margin:0 0 0.75rem; }
  .desc { color:rgba(43,37,32,0.7); margin:0 0 2rem; }
  .subscribe-box { background:#FBF8F1; border:1.5px solid rgba(43,37,32,0.14); border-radius:6px; padding:1.25rem 1.5rem; margin-bottom:2.5rem; }
  .subscribe-box p { margin:0 0 0.6rem; font-size:0.92rem; }
  .feed-url { font-family:monospace; font-size:0.82rem; background:#EFE9DC; padding:0.5rem 0.75rem; border-radius:4px; word-break:break-all; display:block; color:#B5482E; }
  .item { border-top:1px solid rgba(43,37,32,0.14); padding:1.5rem 0; }
  .item:first-child { border-top:none; }
  .item-date { font-family:monospace; font-size:0.7rem; letter-spacing:0.06em; color:rgba(43,37,32,0.45); }
  .item h2 { font-family:Georgia,serif; font-size:1.15rem; margin:0.3rem 0 0.4rem; }
  .item h2 a { color:#2B2520; text-decoration:none; }
  .item h2 a:hover { color:#B5482E; }
  .item p { color:rgba(43,37,32,0.65); font-size:0.9rem; margin:0; }
</style>
</head>
<body>
<div class="wrap">
  <p class="eyebrow">RSS FEED</p>
  <h1><xsl:value-of select="title"/></h1>
  <p class="desc"><xsl:value-of select="description"/></p>
  <div class="subscribe-box">
    <p>This is an RSS feed, not a regular page. Copy the URL below into a feed reader (Feedly, NetNewsWire, Reeder, Inoreader, etc.) to subscribe and get new posts automatically.</p>
    <span class="feed-url"><xsl:value-of select="atom:link/@href"/></span>
  </div>
  <div class="items">
    <xsl:for-each select="item">
      <div class="item">
        <span class="item-date"><xsl:value-of select="pubDate"/></span>
        <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
        <p><xsl:value-of select="description"/></p>
      </div>
    </xsl:for-each>
  </div>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
