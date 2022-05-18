import { useState } from 'react';
import CommentsGotModal from '../pageElements/modals/CommentsGotModal';

const initialState = {
  visibility: false,
  postId: "null"
};

export default function useCommentsModal() {

  const [commentsModalRun, setCommentsModalRun] = useState(false);
  const [commentsModal, setCommentsModal] = useState(()=>{return initialState});
  //Whether or not the user did any comment on the post.
  const [changes, setChanges] = useState(false);


  const handleChanges = (data) => {
    setChanges(data);
  }

  const handleCommentsModal = (data) => {
    if (data.visibility === true) {
      setCommentsModalRun(true);
    } else {
      setCommentsModalRun(false);
    }
    setCommentsModal(data);
  }  

  return [commentsModalRun, commentsModal, changes, handleChanges, handleCommentsModal, CommentsGotModal];
}
