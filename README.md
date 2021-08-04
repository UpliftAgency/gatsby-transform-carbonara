# Gatsby Transform Carbonara

Convert files into to code screenshots using [carbonara](https://github.com/petersolopov/carbonara).

## Getting Started

    yarn add gatsby-transform-carbonara

## Setting Up

```ts
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: path.join(__dirname, "src", "code-examples"),
        name: "code-examples",
      },
    },
    {
      resolve: "gatsby-transform-carbonara",
      options: {
        sourceInstanceName: "code-examples",
        carbonaraOptions: {
          backgroundColor: "rgba(255, 0, 0, 1)",
        },
        carbonaraUrl: "https://carbonara.vercel.app/api/cook",
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
  ],
};
```

## Querying

```ts
import { graphql } from "gatsby";

export const pageQuery = graphql`
  query Carbonara {
    allFile(filter: { sourceInstanceName: { eq: "code-examples" } }) {
      edges {
        node {
          id
          absolutePath
          childImageSharp {
            id
            fixed {
              srcSet
            }
          }
        }
      }
    }
  }
`;
```

## Hiring

Uplift is hiring! Work on fun projects with us! [Apply](https://www.uplift.ltd/careers/)
