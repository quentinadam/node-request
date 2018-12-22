# Request

## Examples

```typescript
import Request from '@quentinadam/request';

(async () => {
  try {
    const {statusCode, headers, body} = await (new Request({
      url: 'http://www.google.com/search',
      qs: {q: 'nodejs'},
    })).execute();
    console.log(statusCode);
    console.log(headers);
    console.log(body.asString());
  } catch (error) {
    console.error(error);
  }
})();
```

```typescript
import Request from '@quentinadam/request';

(async () => {
  try {
    const {statusCode, headers, body} = await (new Request({
      url: 'http://www.example.com/users',
      method: 'POST',
      form: {
        name: 'Bill',
        age: '38'
      }
    })).execute();
    console.log(statusCode);
    console.log(headers);
    console.log(body.asJSON());
  } catch (error) {
    console.error(error);
  }
})();
```

## Class Request

### new Request({url, qs, method, headers, json, form, body, timeout, keepAlive, gzip})

 - ```url``` ```<string>``` url
 - ```qs``` ```<{[key: string]: string}?>``` (optional) object containing querystring values to be appended to the url
 - ```method``` ```<string? = 'GET'>``` (optional) HTTP method (defaults to ```GET```)
 - ```headers``` ```<{[key: string]: string | string[}?>``` (optional) HTTP headers
 - ```json``` ```<any?>``` (optional) if present, adds a ```content-type: application/json``` header, encodes the provided object in JSON format and sends it in the HTTP body
 - ```form``` ```<{[key: string]: string | string[}?>``` (optional) if present, adds a ```content-type: application/www-form-urlencoded``` header, encodes the provided object in form format and sends it in the HTTP body
 - ```body``` ```<Buffer?>``` (optional) HTTP body
 - ```timeout``` ```<number? = 15000>``` (optional) timeout in milliseconds (defaults to ```15000```)
 - ```keepAlive``` ```<boolean? = true>``` (optional) adds a ```connection: keep-alive``` header and keeps the TCP connection option (defaults to ```true```)
 - ```gzip``` ```<boolean? = true>``` (optional) adds a ```accept-encoding: gzip``` header and decodes the gzip response (defaults to ```true```)
 
### request.execute(): Promise<{statusCode, statusMessage, headers, body}>
 
Executes the request.

 - ```statusCode``` ```<number>```
 - ```statusMessage``` ```<string>```
 - ```headers``` ```<http.IncomingHttpHeaders>```
 - ```body``` ```<Body>```
 
## Class Body

### body.toString(): string

Returns the body as string.

### body.asString(): string

Returns the body as string.

### body.asJSON(): any

Parses the body as JSON and returns the JSON object.

### body.asBuffer(): Buffer

Returns the raw body as a Buffer.
