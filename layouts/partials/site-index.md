{{- /* Markdown index of the site. With "markdown" set, entries link to the Markdown version of each page. */ -}}
{{- $markdown := .markdown -}}
{{- define "entry" -}}
{{- $url := .page.Permalink -}}
{{- if .markdown }}{{ with .page.OutputFormats.Get "markdown" }}{{ $url = .Permalink }}{{ end }}{{ end -}}
- [{{ .page.Title }}]({{ $url }}){{ with .page.Description | default (.page.Summary | plainify | htmlUnescape | truncate 160) }}: {{ . | replaceRE `\s+` " " }}{{ end }}
{{ end -}}
# {{ site.Title }}

> {{ site.Params.description }}

## Pages

- [Home]({{ site.Home.Permalink }})
- [Blog]({{ (site.GetPage "/posts").Permalink }})
{{ range (where site.RegularPages "Section" "!=" "posts").ByTitle }}{{ template "entry" (dict "page" . "markdown" $markdown) }}{{ end }}
## Posts

{{ range (where site.RegularPages "Section" "posts").ByDate.Reverse }}{{ template "entry" (dict "page" . "markdown" $markdown) }}{{ end }}
## Feeds

- [RSS]({{ "rss.xml" | absURL }})
- [XML sitemap]({{ "sitemap.xml" | absURL }})
