# Multi-stage build for Spring Boot 3 Backend
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Production runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S reposage && adduser -S reposage -G reposage
USER reposage
COPY --from=build --chown=reposage:reposage /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/reposage?stringtype=unspecified
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=postgres
ENV APP_AUTH_ENABLED=false
ENTRYPOINT ["java", "-jar", "app.jar"]

