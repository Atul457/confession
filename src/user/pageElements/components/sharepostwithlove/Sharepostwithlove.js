import heart from '../../../../images/upvoted.svg';
import heartHovered from '../../../../images/heartHovered.svg';
import { useDispatch } from 'react-redux';
import { toggleShareWithLoveModal } from '../../../../redux/actions/shareWithLoveAc/shareWithLoveAc';

const HeartComponent = () => {

    // Hooks and vars
    const dispatch = useDispatch()

    // Function
    const openSharewithLoveModal = () => {
        dispatch(toggleShareWithLoveModal({
            visible: true
        }))
        console.log("openSharewithLoveModal")
    }

    return (
        <div
            className='heartComp'
            onClick={openSharewithLoveModal}>
            <img
                src={heart}
                className={``} />
            <img
                src={heartHovered}
                className={``} />
        </div>

    )
}

export { HeartComponent }