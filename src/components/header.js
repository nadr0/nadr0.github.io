import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <header
    style={{
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
        display: `flex`,
        flexDirection: `row`,
        alignItems: `center`,
        justifyContent: `space-between`
      }}
    >
      <div
        style={{
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </div>
      <div style={{
        display: `flex`,
        alignItems: `center`,
        flexDirection: `row`,
      }}>
        <Link
          to="/about-me/"
          style={{
            textDecoration: `none`,
          }}
        >
          About me
        </Link>
        <Link
          to="/articles/"
          style={{
            textDecoration: `none`,
          }}
        >
          Articles
        </Link>
        <Link
          to="/contact/"
          style={{
            textDecoration: `none`,
          }}
        >
          Contact
        </Link>
      </div>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
