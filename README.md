```sh
# build image
docker build -t apiproxy .

# create network
docker network create apiproxy-nw

# start mysql container
docker run -d \
    --network apiproxy-nw \
    --network-alias mysql \
    --name apiproxy-db \
    -v apiproxy-mysql-data:/var/lib/mysql \
    mysql:8.0

# start server container and run server
docker run -dp 8000:8000 \
    --name apiproxy \
    --network apiproxy-nw \
    -e PORT=8000 \
    -e IP=0.0.0.0 \
    -e MYSQL_HOST=mysql \
    -e MYSQL_USER=root \
    -e MYSQL_PASSWORD=password \
    -e MYSQL_DB=apiproxydb \
    -e JWT_SECRET="jwt_secret" \
    apiproxy
```
