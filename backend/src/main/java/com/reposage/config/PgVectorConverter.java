package com.reposage.config;

import com.pgvector.PGvector;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.sql.SQLException;

@Converter(autoApply = true)
public class PgVectorConverter implements AttributeConverter<PGvector, String> {

    @Override
    public String convertToDatabaseColumn(PGvector attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public PGvector convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        try {
            return new PGvector(dbData);
        } catch (SQLException e) {
            throw new RuntimeException("Failed to parse PGvector from database string: " + e.getMessage(), e);
        }
    }
}
