---
title: How to Automatically Generate Clients for your REST API
date: 2020-12-19T15:00:00+02:00
type: post
authors:
  - Roald Nefs
categories:
  - Development
draft: false
featured: true
---

While helping a colleague with adding some code to the [bunq Python SDK][bunq-sdk] to allow him to retrieve some additional information from the API ([bunq/sdk_python#148][bunq-issue]), we noticed that the [SDK][bunq-sdk] was automatically generated. We've eventually ended up monkey patching the [SDK][bunq-sdk], as we couldn't make a pull request to the [SDK][bunq-sdk] and the API specification or SDK generator wasn't publicly available. However, this aroused some interest about the automatic generation of API clients.

In this post we will automatically generate a [REST API][rest-api] client based upon an [OpenAPI specification][openapi-spec]. The [OpenAPI specification]([openapi-spec]) allows [REST APIs][rest-api] to be described in a standard programming [language-agnostic][language-agnostic] way, making it possible for both humans and computers to interpret the specification.

## Write the OpenAPI specification

Even though quite a lot of REST APIs nowadays come included with an [OpenAPI specification][openapi-spec], this is not the case for all of them. In this post we will be using the JSON interface on [xkcd][xkcd] as an example. We will start by describing the [OpenAPI specification][openapi-spec] for the two existing endpoints: 

```
GET: http://xkcd.com/info.0.json (current comic)
GET: http://xkcd.com/614/info.0.json (comic #614)
```

Let's start by creating a file called `openapi.yaml`. After filling in some basic information such as the API information and available server(s), we can add the individual endpoints. The specification below only contains the endpoint for retrieving a [xkcd][xkcd] comic by its identifier.

```yaml
openapi: 3.0.0

info:
  version: 1.0.0
  title: xkcd
  description: 'A webcomic of romance, sarcasm, math, and language.'

servers:
  - url: https://xkcd.com/
    description: Official xkcd JSON interface

paths:
  # Retrieve a comic by its identifier
  /{id}/info.0.json:
    get:
      tags:
        - comic
      description: Returns comic based on ID
      summary: Find comic by ID
      operationId: getComicById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Successfully returned a commmic
          content:
            application/json:
              schema:
                type: object
                properties:
                  link:
                    type: string
                  img:
                    type: string
                  title:
                    type: string
```

## Automatically generate a Python SDK

The [OpenAPI Generator][openapi-generator] allows the generation of API client libraries and documentation for multiple languages and frameworks given an [OpenAPI specification][openapi-spec]. This includes generators for _Python_, _Go_, _Java_ and many more.

Even though the [OpenAPI Generator][openapi-generator] is written in Java, you can use the [pre-built Docker image][openapi-generator-cli] to act as a standalone executable. The command below will generate a Python SDK based upon the specification (`openapi.yaml`):

```console
$ docker run --rm \
  -v ${PWD}:/local openapitools/openapi-generator-cli generate \
  -i /local/openapi.yaml \
  -g python \
  -o /local/out/python \
  --additional-properties=packageName=xkcd_client,projectName=xkcd_client
```

After execution the newly generated Python SDK is available in `./out/python` and comes included with the necessary documentation to start using it. It even comes with a `.openapi-generator-ignore` file which let you specify files to prevent them from being overwritten by the generator.

## Improve the OpenAPI specification

Even though we can now use the newly generated SDK, it comes with some very generic class names and ill-favoured function names, e.g.:

```python
import xkcd_client


# Initialize a xkcd API client
configuration = xkcd_client.Configuration(host="https://xkcd.com")
client = xkcd_client.ApiClient(configuration)
api_instance = xkcd_client.api.default_api.DefaultApi(api_client)

# Retrieve a comic by identifier
api_response = api_instance.id_info0_json_get(614)
```

Let's improve the [OpenAPI specification][openapi-spec] to allow the generation of some more human friendly code. To rename the `DefaultApi` class we will need to logical group endpoints by adding the `tags` option:

```yaml
...
paths:
  # Retrieve the current comic
  /{id}/info.0.json:
    get:
      # A list of tags to logical group operations by resources and any other
      # qualifier. 
      tags:
        - comic
      description: Returns comic based on ID
...
```

In order to rename the function `DefaultApi.id_info0_json_get` we can specify a unique `operationId` to allow tools and libraries to uniquely identify an operation:

```yaml
...
paths:
  # Retrieve the current comic
  /{id}/info.0.json:
    get:
      # A list of tags to logical group operations by resources and any other
      # qualifier. 
      tags:
        - comic
      description: Returns comic based on ID
      # Unique identifier for the operation, tools and libraries may use the
      # operationId to uniquely identify an operation.
      operationId: getComic
...
```

The full [OpenAPI specification][openapi-spec] of the [xkcd] JSON interface is available on [GitHub][xkcd-spec].

## Using the generated Python SDK

After generation of the Python SDK we can create a Python virtual environment and install the generated [xkcd][xkcd] Python API client using the following commands:

```console
$ python3 -m venv env
$ source env/bin/activate
$ pip install -e ./out/python
```

After installing the generated API client, we could for example retrieve the [xkcd comic about an API][xkcd-api] using the following Python snippet:

```python
from pprint import pprint

from xkcd_client import Configuration, ApiClient, ApiException
from xkcd_client.api.comic_api import ComicApi


configuration = Configuration(host="https://xkcd.com")

# Enter a context with an instance of the API client
with ApiClient(configuration) as client:
    # Create an instance of the API class
    instance = ComicApi(client)

    try:
        # Retrieve the API comic
        api_response = instance.get_comic_by_id(1481)
        pprint(api_response)
    except ApiException as exc:
        print("Exception when calling ComicApi->get_comic_by_id: {0}\n".format(exc))
```

## Conclusion

In general, it's quite possible to automatically generate a [REST API][rest-api] based upon [OpenAPI specification][openapi-spec]. Even for [REST APIs][rest-api] that do not include a [OpenAPI specification][openapi-spec] by default you can easily describe the API in a [specification][openapi-spec] file to allow the API client generation. Although this post didn't go in depth about API authentication, cookie usage or other HTTP methods, they are all possible features of the [OpenAPI specification][openapi-spec] and [OpenAPI Generator][openapi-generator]. However, results and options may differ based upon the language or framework you would like to generate the SDK in.

Even though the generated code may seem a bit rough, it's well documented and could be made more human friendly by improving the [API specification][openapi-spec].

[rest-api]: https://en.wikipedia.org/wiki/Representational_state_transfer
[bunq-sdk]: https://github.com/bunq/sdk_python
[bunq-issue]: https://github.com/bunq/sdk_python/issues/148
[openapi-spec]: https://swagger.io/specification/
[openapi-generator]: https://github.com/OpenAPITools/openapi-generator
[openapi-generator-cli]: hub.docker.com/r/openapitools/openapi-generator-cli
[xkcd]: https://xkcd.com/
[xkcd-api]: https://xkcd.com/1481/
[xkcd-spec]: https://gist.github.com/roaldnefs/053e505b2b7a807290908fe9aa3e1f00
[language-agnostic]: https://en.wikipedia.org/wiki/Language-agnostic
