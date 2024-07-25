// dataTransformer.ts

import { openai } from '@ai-sdk/openai';
import { JSONParseError, TypeValidationError, generateObject } from 'ai';
import { z } from 'zod';

const tableSchema = z.object({
  transformedData: z.unknown(), // placeholder - couldn't get schema validation working well yet
  transformedHeaders: z.unknown(), // placeholder
  });

type Data = z.infer<typeof tableSchema>;

export async function transformData(csvData: string, reqHeaders: string): Promise<
  | { type: 'success'; data: Data }
  | { type: 'parse-error'; text: string }
  | { type: 'validation-error'; value: unknown }
  | { type: 'unknown-error'; error: unknown }
> {
  try {
    console.log(csvData)
    console.log(reqHeaders)
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: tableSchema,
      prompt: `Thoroughly analyze the CSV Data included below 
      and determine the most important data transformations to 
      perform to extract value from the data.
      This could include re-formating data columns, 
      normalizing data, deriving new data freatures, 
      or calculating new metrics.
      First determine which columns and headers should be included, 
      then calculate the required data to populate the columns. 
      ${reqHeaders.length > 0 ? `The following columns must be included: ${reqHeaders}.` : ''}      
      The order of the columns should be logical and preserved to original data when possible. 
      Finally return transformed data as a transformedData array such that 
      each row is an object in an array similar to the example below:
      "transformedData": [
         { "column 1": "value 1", "column 2": "value 1", "column 3": "value 1"},
         { "column 1": "value 2", "column 2": "value 2", "column 3": "value 2"},
      ]
      The response should be formatted according 
      to the schema provided.
      \n\nCSV Data:\n${csvData}
      `,
    });
    return { type: 'success', data: result.object };
  } catch (error) {
    if (TypeValidationError.isTypeValidationError(error)) {
      return { type: 'validation-error', value: error.value };
    } else if (JSONParseError.isJSONParseError(error)) {
      return { type: 'parse-error', text: error.text };
    } else {
      return { type: 'unknown-error', error };
    }
  }
}