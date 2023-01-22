# &lt;ax-comments&gt; element demo

## Quick start
### Development

1. Put latest `comments-element-esm.js` into `./demo/js`

2. Replace
```html
<script type="importmap">
{
    "imports": {
        "comments-element": "https://cdn.jsdelivr.net/npm/ax-comments@latest/dist/bundle/comments-element-esm.js"
    }
}
</script>
```
With
```html
<script type="importmap">
{
    "imports": {
        "comments-element": "./js/comments-element-esm.js"
    }
}
</script>
```
In `./demo/index.html`
3. Execute
```console
$ npx serve
```

4. Open
```
http://localhost:3000
```