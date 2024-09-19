<a>
  <h1 align="left">Easy ETL</h1>
</a>

## Introduction 

Easy ETL is a basic proof-of-concept AI app that attempts to "Extract, Transform, and Load" user provided data in an automated + repeatable way.

Currently built using [Next.js](https://nextjs.org/), [Groq](https://sdk.vercel.ai/providers/ai-sdk-providers/groq), and deployed on [Vercel](https://vercel.com/docs). [Shadcn/ui](https://ui.shadcn.com/) is used for easy, clean UI components. 

<a>
    <img alt="Easy ETL - Instantly build ETL pipelines to transform your csv for downstream tasks or analysis" src="/public/easy-etl.png">
</a>

## Main Features

* AI-suggested ETL pipeline processed user-provided csv data in to transformed table.
* "Revise" and "Retry" table transformations.

## To-Do:

- [X] Allow option to load more table entries
- [X] Add support for xls file import
- [ ] Save and load previous ETL "policies"
- [ ] Add more data examples
- [ ] Prompt tuning and unit testing
- [ ] Formatting and styling updates
