import React from "react"

import Layout from "../components/layout"
import Introduction from "../components/introduction"
import SEO from "../components/seo"
import ArticleLinks from "../components/articlelinks"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Introduction/>
    <ArticleLinks/>
  </Layout>
)

export default IndexPage
