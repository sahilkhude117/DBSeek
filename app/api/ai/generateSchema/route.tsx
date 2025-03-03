import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { schema } = body;

    // Validate the schema
    if (!Array.isArray(schema) || schema.length === 0) {
      return NextResponse.json(
        { error: 'Invalid schema. Must be a non-empty array of columns.' },
        { status: 400 }
      );
    }

    // Ensure each column has a valid name and type
    const isValidSchema = schema.every(
      (column) => typeof column.name === 'string' && typeof column.type === 'string'
    );

    if (!isValidSchema) {
      return NextResponse.json(
        { error: 'Invalid schema format. Each column must have a "name" and "type".' },
        { status: 400 }
      );
    }

    // Serialize the schema into a readable JSON string
    const schemaString = JSON.stringify(schema, null, 2);

    // Generate the SQL query using OpenAI
    const result = await generateObject({
      model: openai("gpt-4o"),
      system: `
        You are a SQL expert specializing in PostgreSQL. Your task is to generate a proper SQL \`CREATE TABLE\` statement based on the provided schema. Follow these rules:

        1. Use a relevant table name derived from the schema's context (e.g., "unicorns" for unicorn-related data). If no clear context is available, use "dynamic_table".
        2. All columns should be nullable by default (no NOT NULL constraints).
        3. Use only valid PostgreSQL data types:
           - TEXT for strings.
           - INTEGER for whole numbers.
           - NUMERIC(10, 2) for decimals.
           - DATE for dates.
           - TIMESTAMP for date-time values.
           - BOOLEAN for true/false values.
           - JSONB for JSON-like data.
        4. Include a primary key column named "id" with the SERIAL type if no primary key is explicitly provided in the schema.
        5. Format the output as a valid SQL \`CREATE TABLE\` statement.
        6. Ensure the query is clean, readable, and follows PostgreSQL conventions.
        7. Sanitize the input to prevent malicious queries.
      `,
      prompt: `
        Generate a SQL \`CREATE TABLE\` statement for PostgreSQL based on the following schema:

        Schema:
        ${schemaString}

        Rules:
        - Use a relevant table name derived from the schema's context (e.g., "unicorns" for unicorn-related data). If no clear context is available, use "dynamic_table".
        - Add a primary key column named "id" with the SERIAL type if no primary key is explicitly provided.
        - All fields should be nullable.
        - Only use valid PostgreSQL data types.
        - Sanitize the input to prevent malicious queries.

        Output the SQL query directly.
      `,
      schema: z.object({
        query: z.string(),
      }),
    });

    // Return the generated SQL query
    return NextResponse.json({
      sqlQuery: result.object.query,
    });
  } catch (e) {
    console.error('Error generating schema:', e);
    return NextResponse.json({ error: 'Failed to generate schema' }, { status: 500 });
  }
}