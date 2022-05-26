import React from 'react'

export default function SiteLoader() {
  return (
    <div className="siteLoader">
      <div className="spinner-border text-warning loaderColor" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
