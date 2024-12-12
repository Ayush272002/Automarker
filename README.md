# Automarker

## How it Works
As the name suggests its an automarking application which allows the teacher to publish an assignment by uploading a skeleton code, marking script and dockerfile which will have the steps how to containerise the submission and run the marking script which would be uploaded to upload care (AWS S3 could be also used to store them). Once the student of that particular course logs in they would be able to download the skeleton code and fill in their logic for solving the assigned problem, when submitted, the assignment would be uploded to upload care sdk and a link would be provided which is then sent to the backend. The backend sends the submssion details as a payload to a kafka queue which is then picked by the engine at its own pace and then the engine SSH into an AWS EC2 instance and runs the docker container and the marking scipt over there and gathers the log and filters the marks as the marks and then updates it into the database.

Currently the engine is configured to 4 tests and the log should be in the format `Number of tests passed: 3` which can be configured and made more dynamic.

NOTE : Docker and dos2unix must be installed in the EC2 instance. 
- Docker installation guide is [here](https://docs.docker.com/engine/install/)
- for installing dos2unix use the following command
```shell
sudo apt-get update && sudo apt-get install -y dos2unix
```

There is also an OpenAPI spec present inside `apps/backend` which documents all the API endpoints, so the API can be used by developers.

## System Design
Below is the system design for the application.

![System Design](/images/sysDesign.png)



## Tech Stack

#### Frontend
- **Framework**: Next.js  

#### Backend
- **Framework**: Node.js with Express.js  
- **Microservices**: Node.js  

#### Communication
- **Asynchronous Messaging**: Apache Kafka  

#### Database
- **Database**: PostgreSQL  
- **ORM**: Prisma  

#### Development Workflow & Code Quality
- **Monorepo Management**: Turborepo  
- **Pre-commit Hooks**: Husky  
- **Code Formatting**: Prettier  
- **Linting**: ESLint  

#### DevOps & Infrastructure
- **CI/CD**: GitHub Actions  
- **Containerization**: Docker  
- **Cloud**: AWS EC2  

#### Monitoring & Performance
- **Metrics Collection**: Prometheus  
- **Visualization**: Grafana  


## Running the project locally

Clone the repository and install dependencies.

```shell
https://github.com/Ayush272002/Automarker.git
cd Automarker
npm i
```

### Running the Frontend 

Go to apps/frontend create a `.env` file and fill all the details which are there in the .env.example. A free API Key for upload care could be obtained from [here](https://uploadcare.com/) 
```
npm run build:ui
npm run dev:frontend
```

### Running the backend, engine, Prometheus, and Grafana

For this section, you need to have [Docker](https://docs.docker.com/engine/install/) installed. You also need to fill in the required details in the `docker-compose.yml` file, such as the `DATABASE_URL`, `KAFKA_URI`, `KAFKA_USERNAME`, `KAFKA_PASSWORD`, and AWS credentials.

- A free Apache Kafka instance can be obtained from [Aiven Kafka](https://aiven.io/).
- For AWS keys, you need to create an [AWS EC2 instance](https://aws.amazon.com/), and obtain an SSH private key for SSH access to EC2.

Once all the necessary details are filled in, go to the root directory of the project and run:

```shell
docker-compose up
```

This will launch the following services:

- **Backend**: The backend service will run the API that handles incoming requests and communicates with other services like Kafka and the database.
- **Engine**: The engine service processes the submissions, runs the Docker container, executes the marking script, and updates the marks.
- **Prometheus**: A monitoring service that collects metrics and stores time-series data about the health of the application.
- **Grafana**: A visualization service that displays data collected by Prometheus, which can be used for monitoring and performance tracking.

### Accessing the Services

- **Backend API**: Once the containers are running, you can access the backend API at `http://localhost:8000` (configured in the `docker-compose.yml` file).
- **Prometheus**: Access the Prometheus web UI at `http://localhost:9090` to view the collected metrics.
- **Grafana**: Access Grafana at `http://localhost:3001` with the default admin credentials (`admin`/`admin`). You can configure it to connect to Prometheus for monitoring data.

---

### Stopping the Services

To stop all the services running in Docker containers, use the following command:

```shell
docker-compose down
```

This will shut down the running services and remove the containers.

---

### Report 
The report of the prototype could be found in the `Report PDF & LaTeX Files`

### Troubleshooting

- **Missing Docker Compose**: Ensure that Docker Compose is installed. You can verify by running `docker-compose --version`. If not installed, follow the installation instructions [here](https://docs.docker.com/compose/install/).
  
- **Environment Variables**: Make sure all environment variables in the `.env` file (for the frontend and backend) are properly filled in with the correct values, such as Kafka URI, AWS credentials, database connection strings, etc.

- **Docker Build Issues**: If you encounter issues while building or running Docker containers, check the logs for any errors. You can view the logs using:

  ```shell
  docker-compose logs
  ```

---

### Additional Configuration

If you need to scale the services (e.g., running multiple instances of the backend or engine), you can modify the `docker-compose.yml` file accordingly, increasing the `replicas` count for each service.

For Prometheus and Grafana configurations, refer to their respective official documentation for advanced setup, such as adding more data sources or setting up custom dashboards in Grafana.

## Contributing
To contribute to the repository, fork the repository, make a new branch (named something relevant to the feature you are adding / bug you are trying to fix), commit any changes you want to commit to your repository, and then send in a pull request to this repository.

