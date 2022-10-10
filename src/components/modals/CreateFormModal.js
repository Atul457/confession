import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../../commonApi'
import { resHandler } from '../../helpers/helpers'
import * as yup from 'yup';
import { apiStatus } from '../../helpers/status'
import { createForumModalFnAc, forumHandlers, reqToJoinModalAcFn } from '../../redux/actions/forumsAc/forumsAc'
import { ShowResComponent } from '../HelperComponents'
import { getKeyProfileLoc } from "../../helpers/profileHelper"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import forum_types_arr from '../forums/forumTypes.json';

const CreateFormModal = () => {

  const createForumSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    category_id: yup.string().required(),
    type: yup.string().required()
  });

  const { handleForums } = forumHandlers
  const { register, formState: { errors }, handleSubmit } = useForm({
    mode: "onChange",
    resolver: yupResolver(createForumSchema)
  })

  let error = Object.values(errors)
  error = error.length ? error[0] : ""

  const { modals, categories } = useSelector(state => state.forumsReducer)
  const { createForumModal } = modals
  const isError = createForumModal.status === apiStatus.REJECTED
  const message = createForumModal?.message
  const isLoading = createForumModal.status === apiStatus.LOADING
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(createForumModalFnAc({
      visible: false,
      status: apiStatus.IDLE,
      message: "",
      data: {
        title: "",
        description: "",
        category_id: undefined,
        post_as_anonymous: undefined,
        image: undefined,
        type: undefined,
        tags: []
      }
    }))
  }

  // Get Forums
  const getForums = async (append = false) => {
    let obj = {
      token: getKeyProfileLoc("token", true) ?? "",
      method: "get",
      url: `getmyforums/1`
    }
    try {
      let res = await fetchData(obj)
      res = resHandler(res)
      dispatch(handleForums({ data: res?.forums ?? [], status: apiStatus.FULFILLED }))
    } catch (error) {
      console.log(error)
    }

    if (0) console.log(append)
  }

  const onSubmit = async (data) => {
    data = {
      ...data,
      "image": null,
      post_as_anonymous: getKeyProfileLoc("post_as_anonymous"),
      tags: ["A", "B"]
    }

    let token = getKeyProfileLoc("token", true) ?? "";
    dispatch(createForumModalFnAc({
      status: apiStatus.LOADING
    }))

    let obj = {
      data,
      token,
      method: "post",
      url: `createforum`
    }

    try {
      const res = await fetchData(obj)
      resHandler(res)
      dispatch(createForumModalFnAc({
        status: apiStatus.FULFILLED,
        message: "Forum created sucessfully"
      }))
      getForums()
      closeModal()
    } catch (err) {
      dispatch(createForumModalFnAc({
        status: apiStatus.REJECTED,
        message: err.message
      }))
    }
  }



  return (
    <>
      <Modal
        show={createForumModal.visible}
        onHide={closeModal}
        size="lg"
        className='send_joinreq_modal'>
        <Modal.Header>
          <h6>Add New Forums</h6>
          <span onClick={closeModal} type="button">
            <i className="fa fa-times" aria-hidden="true"></i>
          </span>
        </Modal.Header>
        <Modal.Body className="privacyBody friendReqModalBody">
          <form
            className="col-12 p-0 m-0 bg-white createPostOuterCont my-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="form-control mb-3"
              placeholder='Title'
              {...register("title")} />
            <input
              className="form-control mb-3"
              placeholder='Description'
              {...register("description")} />

            <select
              className="form-control mb-3"
              {...register("type")}>
              <option value={""}>Forum Type</option>

              {/* ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}
              {forum_types_arr ? forum_types_arr?.map((element) => {
                return <option
                  key={`createPost ${element.id}`}
                  value={element.id}>
                  {(element.type_name).charAt(0) + (element.type_name).slice(1).toLowerCase()}
                </option>
              }) : <option value="">Forums types not found</option>}
              {/* END OF ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}

            </select>

            <select
              className="form-control mb-3"
              {...register("category_id")}>
              <option value={""}>Select Category</option>

              {/* ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}
              {categories?.data ? categories?.data?.map((element) => {
                return <option key={`createPost ${element.id}`} value={element.id}>{(element.category_name).charAt(0) + (element.category_name).slice(1).toLowerCase()}</option>
              }) : <option value="">Categories not found</option>}
              {/* END OF ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}

            </select>

            {error?.message && error?.message !== "" ?
              <ShowResComponent isError={true} message={error?.message} classList="w-100 text-center pb-2" />
              : null}

            {message && message !== "" ?
              <ShowResComponent isError={isError} message={message} classList="w-100 text-center pb-2" />
              : null}

            <Button
              className="reqModalFootBtns"
              style={{
                margin: "0 auto",
                "marginBottom": "20px"
              }}
              variant="primary"
              type="submit"
            >
              {isLoading ?
                <div className="spinner-border text-white" role="status">
                  <span className="sr-only">Loading...</span>
                </div> : "Submit"}
            </Button>

          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CreateFormModal