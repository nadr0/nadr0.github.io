import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const AboutMe = () => {
  return (
  <Layout>
    <SEO title="Fine Art" />
    <h1>Fine Art Photography</h1>

    <h3>CHICAGO WORKS: A Captivating Art Exhibition by <a href="https://j2gallery.com">Jackson Junge Gallery</a></h3>
    <div style={{textAlign:'center'}}>
      <img src="/bearing-the-elements.jpg"/>
      <p><i>Bearing the elements</i></p>
    </div>

    <blockquote>Far from romanticizing the city, this exhibition seeks to unveil the raw grittiness of Chicago's lived experience while nurturing a profound admiration and appreciation for its familiar aspects. In his artwork titled "Bearing the Elements”, Kevin Nadro captures the chaos and anxiety of traversing the city amidst never-ending construction. He remarks, "As I walk around my neighborhood of Wicker Park the improvements made to the infrastructure put a strain on small sidewalks and streets. Where are you supposed to park several large trucks on a residential street? The noise, detours, and space are apparent to all". One might smile as they read this description, knowing full well the pain of trying to find parking while construction is underway. And should we even mention wintertime “dibs” law?</blockquote>

    <p>The <a href="https://j2gallery.com/exhibitions/">exhibition</a> runs July 11th, 2023 – September 3rd, 2023</p>

    <a href="https://j2gallery.com/store/special-exhibit/bearing-the-elements">Store : Special Exhibit : BEARING THE ELEMENTS</a>

  </Layout>
  )
}

export default AboutMe

