import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '../../../commonApi';
import { getKeyProfileLoc } from '../../../helpers/profileHelper';
import auth from '../../behindScenes/Auth/AuthCheck';
import VerifyInfoModal from '../Modals/VerifyInfoModal';


export default function VerifyEmail() {

    const history = useNavigate();
    const params = useParams();
    const [VerifyIModal, setVerifyIModal] = useState({
        visible: false,
        message: "",
        expired: false
    })
    var userId = params.userId;
    var token = params.token;
    var length = token.length;
    const differentUserLoggedInMssg = "Account could not be verified. Please make sure that you are logged in using the same email on which the verification link was sent."

    useEffect(() => {
        if (userId && token && (length > 20)) {
            async function verifyemail() {
                let obj = {
                    data: {},
                    token: token,
                    method: "get",
                    url: `verifyemail/${userId}/${token}`
                }

                try {
                    const res = await fetchData(obj)
                    if (res.data.status === true) {
                        if (auth() && getKeyProfileLoc("user_id") !== userId)
                            return setVerifyIModal({
                                ...VerifyIModal,
                                message: differentUserLoggedInMssg,
                                showLogginBtn: true,
                                visible: true
                            })
                        history("/login");
                    } else {
                        setVerifyIModal({
                            ...VerifyIModal,
                            message: res.data.message,
                            visible: true
                        })
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            verifyemail();
        }
    }, []);

    const closeModal = () => {
        setVerifyIModal({ ...VerifyIModal, visible: false, expired: true });
    }

    useEffect(() => {
        if (VerifyIModal.expired === true)
            history("/login");
    }, [VerifyIModal.expired])


    return (
        <VerifyInfoModal
            visible={VerifyIModal.visible}
            showLogginBtn={VerifyIModal?.showLogginBtn ?? false}
            message={VerifyIModal.message}
            redirect={closeModal} />
    );
}
