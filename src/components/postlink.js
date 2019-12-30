import React from "react"
import { Link } from "gatsby"
import Tags from "./tags"

const PostLink = ({ post }) => {
  const categories = post.frontmatter.categories;
  return(
    <div className="postlink">
    <Link to={post.frontmatter.path}>
    {post.frontmatter.title} ({post.frontmatter.date})
    </Link>
    <Tags tags={categories}/>
    </div>)
}

export default PostLink
