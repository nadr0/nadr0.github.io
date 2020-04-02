import React from "react"
import { Link } from "gatsby"
import Tags from "./tags"

const PostLink = ({ post }) => {
  const categories = post.frontmatter.categories;
  return(
    <Link to={post.frontmatter.path}>
      <div className="postlink">
        <div>
          {post.frontmatter.title} ({post.frontmatter.date})
        </div>
        <Tags tags={categories}/>
      </div>
    </Link>
    )
}

export default PostLink
