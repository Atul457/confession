import heart from '../../../../images/upvoted.svg';
import heartHovered from '../../../../images/heartHovered.svg';
import { useDispatch, useSelector } from 'react-redux';
import { toggleShareWithLoveModal, resetShareWithLoveModal } from '../../../../redux/actions/shareWithLoveAc/shareWithLoveAc';
import { Button, Modal } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { useRef, useState } from "react"
import { sharePWLTiles } from '../../../../helpers/sharePWLTiles/sharePWLTiles';


const ShareWithLoveModal = () => {

    // Hooks and vars
    const shareWithLoveReducer = useSelector(state => state.shareWithLoveReducer)
    const dispatch = useDispatch()
    const writePostBoxRef = useRef()
    const [activeTile, setActiveTile] = useState(0)
    let tilesArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


    // Functions
    const closeModal = () => {
        dispatch(resetShareWithLoveModal())
    }

    // Click post box
    const clickPostBox = () => {
        if (writePostBoxRef.current) writePostBoxRef.current.focus()
    }

    return (
        <Modal
            show={shareWithLoveReducer.visible}
            onHide={closeModal}
            className='sharePWLModal'
            size="lg">
            <Modal.Header className='justify-content-between'>
                <h6>Spread the Love</h6>
                <span onClick={closeModal} type="button">
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            </Modal.Header>
            <Modal.Body className="sharePWLConts">
                <div className="sharePWLHeading">
                    Spread positive thoughts on the platform. Give some love.
                    <br />
                    Add a positive note for other users to get inspired.
                </div>

                <div className="sharePWLBgTiles">
                    {tilesArr.map((tile, index) => {
                        return <img
                            onClick={() => setActiveTile(index)}
                            className={`tile ${activeTile === index ? "sharePWLActiveTile" : ""}`}
                            key={tile}
                            src={sharePWLTiles[index].src} />
                    })}
                </div>

                <div
                    className="sharePWLWritePostBox"
                    onClick={clickPostBox}
                    style={{
                        backgroundImage: `url('${sharePWLTiles[activeTile].src}')`
                    }}
                >
                    <TextareaAutosize
                        ref={writePostBoxRef}
                        placeholder='Type Your post Here'
                        minRows={1} />
                </div>
            </Modal.Body>
            <Modal.Footer className="sharePWLMfooter sharePWLConts">
                <Button className="doPostBtn" variant="primary">
                    Post
                </Button>
            </Modal.Footer>
        </Modal>
    )
}


const HeartComponent = () => {

    // Hooks and vars
    const dispatch = useDispatch()

    // Function
    const openSharewithLoveModal = () => {
        dispatch(toggleShareWithLoveModal({
            visible: true
        }))
    }

    return (
        <div
            className='heartComp'
            onClick={openSharewithLoveModal}>
            <img
                src={heart}/>
            <img
                src={heartHovered}/>
        </div>

    )
}


export { HeartComponent, ShareWithLoveModal }