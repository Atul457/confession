import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../commonApi';
import { UpdateUPassActionCreators } from '../../../../redux/actions/updateUserPassword'
import statuses from '../../../../redux/reducers/updateUserPassReducer';
import ResetPasswordModal from "../../Modals/ResetPasswordModal";

const ResetPassword = () => {

    const dispatch = useDispatch();
    const params = useParams();
    var [userId] = useState(params.userId);
    var [token] = useState(params.token);

    useEffect(() => {

        const openUpdatePassModal = () => {
            dispatch(UpdateUPassActionCreators.openChangePassModal())
        }

        openUpdatePassModal();

        if (!userId || !token || !(token.length > 20)) {
            return dispatch(UpdateUPassActionCreators.hideFieldsUpassModal("Link is not valid"));
        }

        async function verifyPwdLink() {
            let obj = {
                data: {},
                token: token,
                method: "get",
                url: `verifyresetpwdlink/${userId}/${token}`
            }

            try {
                dispatch(UpdateUPassActionCreators.changeBodyStatusUpassModal(statuses.LOADING));
                const res = await fetchData(obj)
                if (res.data.status === false) {
                    dispatch(UpdateUPassActionCreators.hideFieldsUpassModal(res.data.message));
                } else {
                    dispatch(UpdateUPassActionCreators.changeBodyStatusUpassModal(statuses.STOP));
                }
            } catch (err) {
                console.log(err);
            }
        }
        verifyPwdLink();
    }, [dispatch, token, userId])

    return (
        <ResetPasswordModal userId={userId} token={token} />
    )
}

export default ResetPassword