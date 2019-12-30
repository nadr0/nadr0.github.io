import React from "react"
const Tag = ({text}) => {
  return (
    <div
      className="tag"
      style={{
        padding: `2.5px 5px`,
        background: `#ffeaa7`,
        fontSize: `12px`,
        borderRadius: `5px`,
        textTransform: `uppercase`,
        whiteSpace: `nowrap`
      }}
      >
      {text}
    </div>
  )
}

export default Tag
