{{- define "entry" -}}
- [{{ .Title }}]({{ .Permalink }}){{ with .Description | default (.Summary | plainify | htmlUnescape | truncate 160) }}: {{ . | replaceRE `\s+` " " }}{{ end }}
{{ end -}}
# {{ site.Title }}

> {{ site.Params.description }}

## Pages

- [Home]({{ site.Home.Permalink }})
- [Blog]({{ (site.GetPage "/posts").Permalink }})
{{ range (where site.RegularPages "Section" "!=" "posts").ByTitle }}{{ template "entry" . }}{{ end }}
## Posts

{{ range (where site.RegularPages "Section" "posts").ByDate.Reverse }}{{ template "entry" . }}{{ end }}
## Feeds

- [RSS]({{ "rss.xml" | absURL }})
- [XML sitemap]({{ "sitemap.xml" | absURL }})
