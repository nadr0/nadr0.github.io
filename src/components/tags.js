import React from "react"
import Tag from './tag'

const Tags = ({tags}) => {
  const t = tags.map((tag, i)=>{
    return <Tag key={i} text={tag}/>
  })
  return (
    <div 
    className="tags"
    style={{
      display: `flex`,
      flexDirection: `row`,
      alignItems: `center`,
      justifyContent: `flex-start`,
      flexWrap: `wrap`
    }}>
      {t}
    </div>
  )
}

export default Tags