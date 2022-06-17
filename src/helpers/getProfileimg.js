import userIcon from '../images/userAcc.png';
import canBeRequested from "../images/canBeRequested.svg";
import alRequested from "../images/alRequested.svg";
import alFriends from "../images/alFriends.svg";

export const ProfileIcon = (profileImg, isNotFriend) => {
    
    // isNotFriend :
    // 0 : SHOW NOTHING
    // 1 : SHOW REQUEST
    // 2: SHOW CANCEL 
    // 3: ALREADY FRIEND

    let profileImage, profileBPlate;

    profileImage = profileImg !== '' ? profileImg : userIcon;

    const getHtml = () => {

        if (isNotFriend === 1) {
            return <>
                <img
                    src={canBeRequested}
                    type="button"
                    alt=""
                    onClick={openFrReqModalFn_Post}
                    className='registeredUserIndicator' />
                <img
                    src={profileImg !== '' ? profileImg : userIcon}
                    className="userAccIcon generated"
                    onClick={openFrReqModalFn_Post}
                    alt=""
                />
            </>
        }

        if (isNotFriend === 2) {
            return <>
                <img
                    src={alFriends}
                    onClick={openFrReqModalFn_Post}
                    type="button"
                    alt=""
                    className='registeredUserIndicator' />
                <img
                    src={profileImg !== '' ? profileImg : userIcon}
                    onClick={openFrReqModalFn_Post}
                    className="userAccIcon"
                    alt=""
                />
            </>
        }

        if (isNotFriend === 3) {
            return <>
                <img
                    src={alRequested}
                    type="button"
                    alt=""
                    className='registeredUserIndicator' />
                <img
                    src={profileImg !== '' ? profileImg : userIcon}
                    className="userAccIcon"
                    alt=""
                />
            </>
        }

        return <img src={profileImage} className="userAccIcon" alt="" />
    }


    profileBPlate = getHtml();
    return profileBPlate;
}