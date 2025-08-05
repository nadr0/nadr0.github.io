import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const MEDIUM_PHOTOGRAPH = 'photograph'
const MEDIUM_SILVER_HALIDE = 'silver halide photograph on aluminum'

const SelectedWorks = () => {
  
  const selectedWorks = [
              {
      width: '600px',
      src: '/glizzy.jpg',
      title: 'Glizzy',
      medium: MEDIUM_PHOTOGRAPH,
      size: '23 ¼" x 23 ¼"',
      framed: true,
      year: 2025,
      seletedYear: 2025
    },
          {
      width: '600px',
      src: '/early-day.jpg',
      title: 'Early day',
      medium: MEDIUM_SILVER_HALIDE,
      size: '10" x 10"',
      framed: true,
      year: 2024,
      seletedYear: 2024
    },
      {
      width: '600px',
      src: '/talk-talk-talk.jpg',
      title: 'Talk talk talk',
      medium: MEDIUM_SILVER_HALIDE,
      size: '10" x 10"',
      framed: true,
      year: 2024,
      seletedYear: 2024
    },
      {
      width: '600px',
      src: '/and-ill-hold-on-for-you.jpg',
      title: 'And I\'ll hold on, for you',
      medium: MEDIUM_PHOTOGRAPH,
      size: '18" x 24"',
      framed: true,
      year: 2024,
      seletedYear: 2024
    },
    {
      width: '600px',
      src: '/Still-Open.jpg',
      title: 'Still Open',
      medium: MEDIUM_PHOTOGRAPH,
      size: '24 ½" x 18 ½"',
      framed: true,
      year: 2020,
      seletedYear: 2024
    },
    {
      width: '600px',
      src: '/Nadro_Koi_Koi-INSTA.jpg',
      title: 'Koi Koi',
      medium: MEDIUM_SILVER_HALIDE,
      size: '10 x 10',
      framed: true,
      year: 2023,
      seletedYear: 2023
    },
    {
      width: '600px',
      src: '/strolls-and-holes.jpg',
      title: 'Bearing The Elements',
      medium: MEDIUM_PHOTOGRAPH,
      size: '37 ¼" x 25 ¼"',
      framed: true,
      year: 2020,
      seletedYear: 2023
    },
    {
      width: '600px',
      src: '/bearing-the-elements.jpg',
      title: 'Bearing The Elements',
      medium: MEDIUM_PHOTOGRAPH,
      size: '36" x 24"',
      framed: true,
      year: 2020,
      seletedYear: 2023
    }
  ]


  return (
  <Layout>
    <SEO title="Selected Works" />
    <h1>Selected Works</h1>

    {selectedWorks.map((selectedWork)=>{
      return (
        <>
          <div style={{textAlign:'left'}}>
            <img style={{marginBottom:'0px', width: selectedWork.width}} src={selectedWork.src} />
            <div style={{fontSize: '14px'}}><i style={{fontSize: '14px'}}>{selectedWork.title}</i>, {selectedWork.medium}, {selectedWork.size} {selectedWork.framed ? '(framed)' : ' '}, {selectedWork.year}, displayed in {selectedWork.seletedYear}</div>
          </div>
          <br></br>
          <br></br>
        </>
      )
    })}

  </Layout>
  )
}

export default SelectedWorks

