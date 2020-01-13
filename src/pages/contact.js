import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Contact = () => (
  <Layout>
    <SEO title="Contact" />
    <p>
      Have any questions, comments, corrections, or just want to say hello? Send me an email at <a href="mailto:sayhello@kevinnadro.com">sayhello@kevinnadro.com</a>
    </p>
    <h3>Social sites</h3>
    <ul>
      <li>
        <a href="https://github.com/nadr0">Github</a>
      </li>
      <li>
        <a href="https://www.npmjs.com/~nadro">npm</a>
      </li>
    </ul>
  </Layout>
)

export default Contact

