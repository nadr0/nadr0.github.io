import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const CHICAGO = 'Chicago, IL'
const JACKSON_JUNGE_GALLERY = 'Jackson Junge Gallery'

const FineArt = () => {
  const groupExhibitions = [
      {
      year:'2025',
      gallery: JACKSON_JUNGE_GALLERY,
      location: CHICAGO,
      title: '#Trending'
    },
    {
      year:'2024',
      gallery: JACKSON_JUNGE_GALLERY,
      location: CHICAGO,
      title: 'TEN by TEN'
    },
    {
      year:'2024',
      gallery: JACKSON_JUNGE_GALLERY,
      location: CHICAGO,
      title: 'Surreal Salon'
    },
    {
      year:'2024',
      gallery: JACKSON_JUNGE_GALLERY,
      location: CHICAGO,
      title: 'No Color'
    },
    {
      year:'2023',
      gallery: JACKSON_JUNGE_GALLERY,
      location: CHICAGO,
      title: 'TEN by TEN'
    },
    {
      year:'2023',
      gallery: JACKSON_JUNGE_GALLERY,
      location: CHICAGO,
      title: 'Chicago Works'
    }
  ]

  return (
  <Layout>
    <SEO title="CV" />
    <h1>CV</h1>

    <p>Kevin Nadro, Chicago, IL</p>

    <h3>Group Exhibitions</h3>
    {groupExhibitions.map((groupExhibition)=>{
      return (
      <p> <span style={{marginRight:'1rem'}}>{groupExhibition.year}</span> {groupExhibition.gallery} | {groupExhibition.location} | {groupExhibition.title} </p>
      )      
    })}

  </Layout>
  )
}

export default FineArt

