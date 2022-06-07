import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../../commonApi';
import { forgotUPassActionCreators } from '../../../redux/actions/forgotUPassword';
import statuses from '../../../redux/reducers/forgotUpReducer';
import { Modal } from 'react-bootstrap';
import Button from '@restart/ui/esm/Button';



const ForgotPassModal = () => {


    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const forgotUserPassReducer = useSelector(store => store.forgotUserPassReducer);

    const closeModal = () => {
        setEmail('');
        dispatch(forgotUPassActionCreators.closeChangePassModal())
    }

    const handleOnChange = (target) => {
        setEmail(target.value)
    }

    const changePass = async () => {

        let token = '';


        if (email === '') {
            return dispatch(forgotUPassActionCreators.updateErrorUpassModal("Email is a required field"));
        }


        if (email.length < 6) {
            return dispatch(forgotUPassActionCreators.updateErrorUpassModal("Please enter a valid email"));
        }

        let data = {
            // password: password.cpass.value,
            // old_password: password.old.value
        }

        let obj = {
            data,
            token: token,
            method: "post",
            url: "updatepassword"
        }
        try {
            dispatch(forgotUPassActionCreators.changeStatusUPassModal(statuses.LOADING))
            const res = await fetchData(obj)
            if (res.data.status === true) {
                closeModal();
            } else {
                return dispatch(forgotUPassActionCreators.updateErrorUpassModal(res.data?.message));
            }
        } catch (err) {
            return dispatch(forgotUPassActionCreators.updateErrorUpassModal("Something went wrong."));
        }


    }

    return (
        <>
            {/* CHANGE PASSWORD MODAL */}
            <Modal show={forgotUserPassReducer.modal.isOpen} onHide={closeModal}>
                <Modal.Header>
                    <h6>Forgot Password</h6>
                    <span onClick={closeModal} type="button">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </Modal.Header>

                <Modal.Body className="privacyBody">

                    <form>
                        <span className="eyeNinputCont">
                            <input
                                className='form-control'
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={email}
                                onChange={(e) => { handleOnChange(e.target) }} />
                        </span>
                    </form>

                    <div className="responseCont text-left text-danger">{forgotUserPassReducer.message}</div>

                </Modal.Body>

                <Modal.Footer className="pt-0">
                    <Button className="modalFootBtns btn" variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>

                    <Button className="modalFootBtns btn" variant="primary" onClick={changePass}>
                        {forgotUserPassReducer.status === statuses.LOADING ? <div className="spinnerSizePost spinner-border text-white" role="status">
                            <span className="sr-only">Loading...</span>
                        </div> : "Send"}
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* CHANGE PASSWORD MODAL */}
        </ >
    )
}

export default ForgotPassModal