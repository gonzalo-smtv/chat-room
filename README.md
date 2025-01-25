# Chat room

Run with docker

- Build the image

```bash
docker build -t chat-room -f ./docker/Dockerfile .
```

- Run the container

```bash
docker run --name chat-room-container --restart always  -p 80:3000 -p 443:3000 chat-room
```
