import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../../commonApi'
import { resHandler } from '../../helpers/helpers'
import * as yup from 'yup';
import { apiStatus } from '../../helpers/status'
import { createForumModalFnAc, forumHandlers } from '../../redux/actions/forumsAc/forumsAc'
import { ShowResComponent } from '../HelperComponents'
import { getKeyProfileLoc } from "../../helpers/profileHelper"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import forum_types_arr from '../forums/forumTypes.json';
import CreatableSelect from 'react-select/creatable';
import classnames from 'classnames'
import { customStyles } from '../forums/detailPage/comments/ForumCommProvider'
import TextareaAutosize from 'react-textarea-autosize'


const CreateFormModal = () => {

  const [nfsw, setNfsw] = useState(false);
  const createForumSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    category_id: yup.string().required(),
    type: yup.string().required()
  });
  const [tagsArr, setTagsArr] = useState([])
  const tagError = false;
  let noOfChar = 250;
  let noOfCharsTitle = 50;

  const { handleForums } = forumHandlers
  const { register, formState: { errors }, formState, handleSubmit, getValues } = useForm({
    mode: "onChange",
    resolver: yupResolver(createForumSchema)
  })
  let error = Object.values(errors)
  error = error.length ? error[0] : ""

  const { modals, categories, tags } = useSelector(state => state.forumsReducer)
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

    if (!tagsArr?.length) return dispatch(createForumModalFnAc({
      status: apiStatus.REJECTED,
      message: "select at least one tag"
    }))

    data = {
      ...data,
      is_nsw: nfsw ? 1 : 0,
      "image": "[]",
      post_as_anonymous: getKeyProfileLoc("post_as_anonymous"),
      tags: JSON.stringify(tagsArr),
      type: +data?.type
    }

    let token = getKeyProfileLoc("token", true) ?? "";
    dispatch(createForumModalFnAc({
      status: apiStatus.LOADING,
      message: ""
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

  const TagsHandle = (action) => {
    const tgg = action.map(curr => curr.value)
    setTagsArr(tgg)
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
        <Modal.Body className="create_forum_modal_body">
          <form
            className="col-12 p-0 m-0 bg-white createPostOuterCont my-4"
            onSubmit={handleSubmit(onSubmit)}
          >

            <div className='w-100 mb-3'>
              <input
                className="form-control"
                placeholder={`Title`}
                maxLength={noOfCharsTitle}
                {...register("title")} />
              <span className="textAreaLimit">[ Max-Characters:{noOfCharsTitle} ]</span>
            </div>

            <div className='w-100 mb-3'>
              <TextareaAutosize
                className="form-control"
                placeholder={`Description`}
                {...register("description")}
                minRows="5"
                maxLength={noOfChar}>
              </TextareaAutosize>
              <span className="textAreaLimit">[ Max-Characters:{noOfChar} ]</span>
            </div>

            <select
              className="form-control mb-3"
              {...register("type")}>
              <option value={""}>Forum Type</option>

              {/* ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}
              {forum_types_arr ? forum_types_arr?.map((element) => {
                return <option
                  key={`createPost ${element.id}`}
                  value={element.id}>
                  {(element.type_name)?.charAt(0)?.toUpperCase() + ((element.type_name)?.slice(1)?.toLowerCase())}
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

            <CreatableSelect
              isMulti
              isClearable={true}
              onChange={TagsHandle}
              options={tags?.data ?? []}
              placeholder="Enter tags"
              components={{
                NoOptionsMessage: () => <div className='text-center'>No tags to show</div>
              }}
              onMenuScrollToTop={true}
              className={classnames("basic-multi-select mb-3", { "is-invalid": tagError })}
              classNamePrefix="select"
              styles={customStyles}
            />

            <div className='w-100 mb-3 nfsw_cont'>
              <div className="toggler_nfsw_cont">
                <label htmlFor="">NFSW</label>
                <input
                  type="checkbox"
                  className="switch12"
                  id="TweightRadio"
                  onChange={(e) => { setNfsw(e.target.checked) }}
                  defaultValue={nfsw ? 1 : 0}
                  checked={nfsw} />
              </div>
              <div className='descr'>
                Users will need to confirm that they are of over legal age to view the content in the forum
              </div>
            </div>


            {error?.message && error?.message !== "" ?
              <ShowResComponent isError={true} message={error?.message} classList="w-100 text-center pb-2 mt-3" />
              : null}

            {message && message !== "" ?
              <ShowResComponent isError={isError} message={message} classList="w-100 text-center pb-2 mt-3" />
              : null}

            <Button
              className="reqModalFootBtns"
              variant="primary"
              type="submit"
              disabled={isLoading}
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