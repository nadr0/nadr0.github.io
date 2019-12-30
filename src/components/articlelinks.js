import React from "react"
import PostLink from "./postlink"
import { useStaticQuery, graphql } from "gatsby"

const ArticleLinks = () => {
  const articleQuery = useStaticQuery(graphql`
    query {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
        edges {
          node {
            id
            excerpt(pruneLength: 250)
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              path
              title
              categories
              tags
            }
          }
        }
      }
    }
  `)
  const edges = articleQuery.allMarkdownRemark.edges;
  const Posts = edges
        .filter(edge => !!edge.node.frontmatter.date) // You can filter your posts based on some criteria
        .map(edge => <PostLink key={edge.node.id} post={edge.node} />)
  return <div className="postlinks">{Posts}</div>
}

export default ArticleLinks
