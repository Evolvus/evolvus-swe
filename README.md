# evolvus-swe
Evolvus Simple Workflow engine

### Prerequisites
1) MongoDB
2) Node

## Building the docker image
sudo docker build -t hobbs.evolvus.com:11083/sandstorm-swe-service .

## Deploying the image to Nexus
docker image push hobbs.evolvus.com:11083/sandstorm-swe-service:latest

## To start the application

export TZ=Asia/Kolkata
export MONGO_DB_URL=mongodb://User:Password@10.24.62.134:27017/testdb?poolSize=100&authSource=admin
export DEBUG=evolvus*

docker run -d --rm --name sandstorm-swe-service -e TZ -e MONGO_DB_URL -e DEBUG -p 8088:8088 182.72.155.166:10515/sandstorm-swe-service:latest


## Contributing
Thank you very much for considering to contribute!

Please make sure you follow our [Code Of Conduct](CODE_OF_CONDUCT.md) and we also strongly recommend reading our [Contributing Guide](CONTRIBUTING.md).
