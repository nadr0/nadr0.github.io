import React from "react"
import GitHubButton from "react-github-btn"

const Introduction = () => {
  return (
    <div>
      <h1>Ope, looks like you ran into me.</h1>
      <div className="introduction-github-buttons">
        <GitHubButton 
          href="https://github.com/sponsors/nadr0"
          data-color-scheme="no-preference: light; light: light; dark: dark;" 
          data-icon="octicon-heart" 
          data-size="large" 
          aria-label="Sponsor @nadr0 on GitHub">Sponsor</GitHubButton> 
        <GitHubButton 
          href="https://github.com/nadr0"
          data-size="large"
          data-show-count="true"
          aria-label="Follow @nadr0 on GitHub">Follow @nadr0</GitHubButton>
      </div>
      <p>Since you are here, check out some of the articles I have written.</p>
    </div>
  )
}

export default Introduction