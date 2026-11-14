# {{ .Title }}

{{ with .Description }}> {{ . }}

{{ end -}}
{{ if eq .Section "posts" -}}
By {{ index (.Params.authors | default (slice site.Params.author.name)) 0 }}, {{ .Date.Format "January 2, 2006" }}. Source: {{ .Permalink }}

{{ end -}}
{{ .RenderShortcodes | string | strings.TrimSpace }}
