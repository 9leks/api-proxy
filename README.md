```
docker run -dp 8000:8000 --name api-proxy api-proxy
```

- [x] Take an existing API (any open one)
- [x] Build a docker-based API proxy around it.
- [] Add a REST-ful database resource to that API, supplementing the original (Think like adding a fake author to a random quote DB).
- [] Add some sort of HTTP authentication to it (jwt is best).
- [] Deploy the app (literally anywhere)
- [] Load-test it (with any tool you want - I love k6).
- [] Build a cache strategy and show me how your cache strategy or storage strategy improves performance.
