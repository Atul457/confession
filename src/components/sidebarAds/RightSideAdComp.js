import React from 'react'
import { envConfig } from '../../configs/envConfig'
import { AdSenseSideAd } from '../../user/pageElements/components/AdSense'
import styles from "./SidebarAdComp.module.css"

const RightSideAdComp = () => {
    return (
        <>
            <div className={styles.outerAdCont}>
                <div className={styles.rightSideAdCont}>
                    {envConfig?.isProdMode ? <AdSenseSideAd /> : null}
                </div>
            </div>
        </>
    )
}

export default RightSideAdComp