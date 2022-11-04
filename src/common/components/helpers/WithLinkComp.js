import React from 'react'
import { Link } from 'react-router-dom'
import { scrollDetails } from '../../../helpers/helpers'


const WithLinkComp = ({ children, link, className = "", ...rest }) => {

    const classList = className === "" ? "" : ` ${className} `
    const props = {
        ...(rest?.rememberScrollPos === true && {
            onClick: () => {
                scrollDetails.setScrollDetails({ pageName: rest?.pageName, scrollPosition: window.scrollY })
            }
        })
    }
    return (
        <Link
            {...props}
            to={link ?? "#"}
            className={`${classList}text-decoration-none`}>
            {children}
        </Link>
    )
}

export default WithLinkComp