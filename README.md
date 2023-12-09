```
#build image
docker build -t apiproxy .

#create network
docker network create apiproxy-nw

# start mysql database
docker run -d \
    --network apiproxy-nw \
    --network-alias mysql \
    --name apiproxy-db \
    -v api-proxy-mysql-data:/var/lib/mysql \
    mysql:8.0

# start server
docker run -dp 8000:8000 \
    --name apiproxy \
    --network apiproxy-nw \
    -e PORT=8000 \
    -e IP=0.0.0.0 \
    -e MYSQL_HOST=mysql \
    -e MYSQL_USER=root \
    -e MYSQL_PASSWORD=password \
    -e MYSQL_DB=guestbook \
    apiproxy
```

- [x] Take an existing API (any open one)
- [x] Build a docker-based API proxy around it.
- [] Add a REST-ful database resource to that API, supplementing the original (Think like adding a fake author to a random quote DB).
- [] Add some sort of HTTP authentication to it (jwt is best).
- [] Deploy the app (literally anywhere)
- [] Load-test it (with any tool you want - I love k6).
- [] Build a cache strategy and show me how your cache strategy or storage strategy improves performance.
