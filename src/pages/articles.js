import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ArticleLinks from "../components/articlelinks"

const Articles = () => {
  return (
    <Layout>
      <SEO title="Articles" />
      <ArticleLinks></ArticleLinks>
    </Layout>
  )
}

export default Articles
