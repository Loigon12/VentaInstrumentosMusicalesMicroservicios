package com.example.POCEmpleado.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${app.mongodb.uri:mongodb://localhost:27017}")
    private String uri;

    @Value("${app.mongodb.database:VentaInstrumentos}")
    private String database;

    @Override
    protected String getDatabaseName() {
        return database;
    }

    // Necesario para que @Indexed(unique = true) (campo "codigo") se cree solo al arrancar
    @Override
    protected boolean autoIndexCreation() {
        return true;
    }

    @Override
    public MongoClient mongoClient() {
        return MongoClients.create(uri);
    }
}
