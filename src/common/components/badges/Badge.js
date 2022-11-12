import React from 'react'

// Image imports
import bronzeBadge from "../../../../src/images/bronzeBadge.svg"
import silverBadge from "../../../../src/images/silverBadge.svg"
import goldBadge from "../../../../src/images/goldBadge.svg"
import platinumBadge from "../../../../src/images/platinumBadge.svg"
import { envConfig } from '../../../configs/envConfig'

const Badge = ({ points = 0, classlist = "" }) => {

    // Vars
    points = parseInt(points)

    // Functions

    // Returns badge image
    const getBadge = () => {

        const getBadgeImage = () => {
            if (envConfig?.isProdMode) {
                if (points >= 100 && points < 1000) return bronzeBadge
                if (points >= 1000 && points < 10_000) return silverBadge
                if (points >= 10_000 && points < 1_00_000) return goldBadge
                if (points >= 1_00_000) return platinumBadge
            } else {
                if (points >= 5 && points < 10) return bronzeBadge
                if (points >= 10 && points < 15) return silverBadge
                if (points >= 15 && points < 20) return goldBadge
                if (points >= 20) return platinumBadge
            }
            return false
        }

        const badgeResult = getBadgeImage()

        // Currently badges are hidden from live
        if (envConfig?.isProdMode) return null

        return (
            badgeResult !== false
                ?
                <img src={badgeResult} className={`badge_for_points${classlist !== "" ? ` ${classlist}` : ''}`} alt='badge' />
                :
                null)
    }

    return (
        <>{getBadge()}</>
    )
}

export default Badge