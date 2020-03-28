import React from "react"
import GitHubButton from "react-github-btn"

const SelfSummary = () => {
  return (
    <div className="introduction-github-buttons">
      <GitHubButton 
        href="https://github.com/nadr0"
        data-size="large"
        data-show-count="true"
        aria-label="Follow @nadr0 on GitHub">Follow @nadr0</GitHubButton>
      <GitHubButton 
        href="https://github.com/sponsors/nadr0"
        data-color-scheme="no-preference: light; light: light; dark: dark;" 
        data-icon="octicon-heart" 
        data-size="large" 
        aria-label="Sponsor @nadr0 on GitHub">Sponsor</GitHubButton> 
    </div>
  )
}

export default SelfSummary
