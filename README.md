#### This is a work in progress that should eventually be a YouTube Shorts clone toy full stack app (if I get the time to work on it).

## It should be:
- A monorepo
- Microservices
- Event driven
- Scalable

## It should use:
- Node.js
- NestJS
- AWS S3, SQS, ECS, CodeBuild, CodePipeline, RDS, DynamoDB
- Docker and Terraform
- Redis/Redlock
- PostgreSQL
- QDrant (for semantic search which is more of a gimmick than an actual usable feature -> my plan is to pre-embed and cache most AI related stuff so I don't have to run a model in my demo)
- Some embedding model on Ollama

## What have I accomplished so far (I hope I remember to update this):
- System design overview
- Basic monorepo architecture with a common (core) project for the post microservice
- A basic post API working with queues and pre-signed URLs and its worker
- Working Dockerfiles for the worker and post API

## Next:
- Create IaC using Terraform and a working pipeline
- Polish the post microservice
- Create user, auth, feed and search microservices
- Maybe a BFF and keep microservices hidden (optional)
- A client using Next or React with Vite
- Deploy a demo
- 👍
