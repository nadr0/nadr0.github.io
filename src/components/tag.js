import React from "react"
const Tag = ({text}) => {
  return (
    <div
      className="tag"
      style={{
        padding: `2.5px 5px`,
        background: `#f8f8f9`,
        fontSize: `12px`,
        borderRadius: `5px`,
        textTransform: `uppercase`,
        color: `#70737a`,
        whiteSpace: `nowrap`
      }}
      >
      {text}
    </div>
  )
}

export default Tag
