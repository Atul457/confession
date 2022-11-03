import React from 'react'
import { Link } from 'react-router-dom'


const WithLinkComp = ({ children, link, className = "", ...rest }) => {
    const classList = className === "" ? "" : ` ${className} `
    const props = {
        // ...(rest?.rememberScrollPos === true && {
        //     state: {
        //         scrollPos: window.scrollY
        //     },
        //     replace: true,
        //     onClick: () => {
        //         console.log("scrollPos" + window.scrollY)
        //     }
        // })
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