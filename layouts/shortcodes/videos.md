{{- /* The Markdown version lists the videos as plain links. */ -}}
{{ range site.Data.videos }}
- [{{ .title }}](https://www.youtube.com/watch?v={{ .id }}) ({{ .channel }}, {{ time.Format "January 2006" .date }}): {{ .description }}
{{- end }}
