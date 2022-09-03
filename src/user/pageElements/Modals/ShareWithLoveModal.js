import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetShareWithLoveModal } from '../../../redux/actions/shareWithLoveAc/shareWithLoveAc'

const ShareWithLoveModal = () => {

    // Hooks and vars
    const dispatch = useDispatch()
    const ShareWithLoveReducer = useSelector(state => state.shareWithLoveReducer)

    // Functions

    // Close modal
    const closeModal = () => {
        dispatch(resetShareWithLoveModal())
    }

    return (
        <Modal show={ShareWithLoveReducer.visible} centered size="md" onHide={closeModal}>
            <Modal.Header className='justify-content-between'>
                <h6>Spread the Love</h6>
            </Modal.Header>
            <Modal.Body className="privacyBody text-center">
                {reportModalReducer.isReported === 0 ? "Are you sure, you want to report this comment?" :
                    "You already have reported this comment"}

                {reportModalReducer.status === apiStatus.FULFILLED &&
                    <div className="mt-2 text-success font-weight-bold">
                        {reportModalReducer.message}
                    </div>}

                {reportModalReducer.status === apiStatus.REJECTED &&
                    <div className={`responseCont mt-2 text-danger`}>
                        {reportModalReducer.message}
                    </div>}

            </Modal.Body>
            <Modal.Footer className="pt-0 justify-content-center">
                {reportModalReducer.isReported === 1 ?
                    <Button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                        Done
                    </Button>
                    :
                    <>
                        <Button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button className="modalFootBtns btn" variant="primary" onClick={reportComment}>
                            {reportModalReducer.status === apiStatus.LOADING ?
                                <div className="spinner-border text-white" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Yes"}
                        </Button>
                    </>}
            </Modal.Footer>
        </Modal>
    )
}

export default ShareWithLoveModal