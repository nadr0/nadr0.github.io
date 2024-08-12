import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Tags from "../components/tags"
import GitHubButtons from "../components/githubbuttons"

const AboutMe = () => {
  return (
  <Layout>
    <SEO title="About me" />
    <h1>Hello, I'm Kevin Nadro.</h1>
    <p>I write open source web and command line applications.</p>

    <p>I have been programming since 2012 and graduated from University of Illinois Urbana-Champaign with a BS in Computer Science. Currently based in Chicago, IL.</p>

    <p>If I am not coding I am bouldering or sport climbing.</p>

    <h3>Open source contributions on GitHub</h3>
    <ul>
      <li><a href="https://github.com/BoostIO/Boostnote">Boostnote</a> - markdown note taker</li>
      <li><a href="https://github.com/algorithm-visualizer/algorithm-visualizer">algorithm-visualizer</a> - interactive algorithm visualizer for learning</li>
    </ul>

    <p>Check me out on GitHub <GitHubButtons/> </p>

    <h3>Why did I create this blog?</h3>
    <p>I wanted to contribute to the open source community in addition to having a place to share my thoughts and work.</p>

    <h3>The content I will be creating.</h3>
    <p>I will be releasing articles about random code I write, projects that I am working on, tutorials with real world examples, and personal pieces on hobbies of mine.</p>
    <p></p>

    <h3>Inspiration</h3>
    <p>I came across <a href="https://www.taniarascia.com/">Tania Rascia's</a> website and thought it was great. I wanted to create something similar.</p>
    <p>I will be following two of her policies that I think will make the internet a heathly place.</p>

    <blockquote>
      <p>I aim to create a beautiful corner of the web free of ads, sponsored posts, newsletter pop-ups, affiliate links, and the rest of the annoying noise we're so accustomed to seeing on the internet these days.</p>
      <footer>—Tania Rascia, <cite>https://www.taniarascia.com/me/</cite></footer>
    </blockquote>

    <blockquote>
      <p>The following things will be ignored: requests to put ads on my website, requests to write sponsored posts for my website, requests to add affiliate links to my website.</p>
      <footer>—Tania Rascia, <cite>https://www.taniarascia.com/contact/</cite></footer>
    </blockquote>

    <p>Note: You may see links to companies websites, product links, or links to things I own. These will never be ads, sponsors, or affiliate links. They are for the purpose of providing you more information about what was talked about in a post not you sell you on it.</p>
  </Layout>
  )
}

export default AboutMe

