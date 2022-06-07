import React, { useState, useEffect } from 'react';
import uploadImages from '../../../../images/uploadImages.png';
import removeImgIcon from '../../../../images/removeImgIcon.png';
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import downArrowIcon from '../../../../images/downArrow.png';
import createPostLogo from '../../../../images/createPostLogo.svg';
import auth from '../../../behindScenes/Auth/AuthCheck';
import { useNavigate } from "react-router-dom";
import { fetchData } from '../../../../commonApi';
import ExtValidator from '../../../../extensionValidator/ExtValidator';
import TextareaAutosize from 'react-textarea-autosize';


export default function CreatePost(props) {

    let history = useNavigate();
    const [categories, setCategories] = useState(false);
    const [selectedCat, setSelectedCat] = useState('');
    const [anonymous, setAnonymous] = useState(true);
    const [selectedFile, setSelectedFile] = useState('');
    const [description, setDescription] = useState("");
    const [submittable, setSubmittable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorOrSuccess, setErrorOrSuccess] = useState(true);
    const [base64Src, setBase64Src] = useState([]);
    const [imgPathArr, setImgPathArr] = useState([]);
    const [isImgLoading, setIsImgLoading] = useState(false);
    // const [recaptchaKey, setRecaptchaKey] = useState("");
    let noOfChar = 2000;

    let fs = 1024; //Sets the max file size that can be sent


    //Prevents img data from being sent empty
    useEffect(() => {
        setSubmittable(true);
    }, [selectedFile])


    useEffect(() => {
        setCategories(props.categories);    //Gets the categories from app.js
    }, [props.categories])


    const preventDoubleClick = (runOrNot) => {
        if (document.querySelector('#postConfBtn')) {
            var elem = document.querySelector('#postConfBtn');
            runOrNot === true ? elem.classList.add("ptNull") : elem.classList.remove("ptNull");;
        }
    }

    async function validateFrom()     // Validates the form
    {
        if (submittable) {
            preventDoubleClick(true);
            let loggedInUserData;
            let descErrorCont = document.getElementById('descErrorCont'), token = '';
            let catErrorCont = document.getElementById('catErrorCont');
            let responseCont = document.getElementById('responseCont');
            let capthaErrorCont = document.getElementById('capthaErrorCont');
            responseCont.innerHTML = '';
            capthaErrorCont.innerText = '';
            catErrorCont.innerText = '';
            descErrorCont.innerText = '';
            let recapToken = "";


            window.grecaptcha.ready(() => {
                window.grecaptcha.execute("6LcFvPEfAAAAAL7pDU8PGSIvTJfysBDrXlBRMWgt", { action: 'submit' }).then(token => {
                    recapToken = token;
                    executePostConfession();
                });
            });

            const executePostConfession = async () => {

                if (auth()) {
                    loggedInUserData = localStorage.getItem("userDetails");
                    loggedInUserData = JSON.parse(loggedInUserData);
                    token = loggedInUserData.token;
                }
                else if (recapToken === '') {
                    // capthaErrorCont.innerText = "Recaptcha is required";
                    console.log("Recaptcha is required")
                    preventDoubleClick(false);
                    return false;
                }

                if (description.trim() === '') {
                    // console.log("empty");
                    descErrorCont.innerHTML = 'Comment required.';
                    preventDoubleClick(false);
                    return false;
                } else {
                    descErrorCont.innerHTML = '';
                }
                if (selectedCat.trim() === '') {
                    catErrorCont.innerHTML = 'Please select a category.';
                    preventDoubleClick(false);
                    return false;
                }
                else {
                    catErrorCont.innerHTML = '';
                    setIsLoading(true);
                    let createPostArr = {
                        "description": description,
                        "category_id": selectedCat,
                        "post_as_anonymous": auth() ? (anonymous ? 1 : 0) : 0,
                        "image": JSON.stringify(imgPathArr),
                        "code": token === '' ? recapToken : ''
                    };

                    // console.log(createPostArr)   //Uncomment to see the data being sent

                    let obj = {
                        data: createPostArr,
                        token: token,
                        method: "post",
                        url: "createconfession"
                    }

                    try {
                        const response = await fetchData(obj)
                        if (response.data.status === true) {
                            setErrorOrSuccess(true);
                            history("/home");
                            responseCont.innerHTML = response.data.message;
                        } else {
                            setErrorOrSuccess(false);
                            responseCont.innerHTML = response.data.message;
                        }
                        setIsLoading(false);
                    } catch {
                        setErrorOrSuccess(false);
                        setIsLoading(false);
                        responseCont.innerHTML = "Server Error, Please try again after some time...";
                    }

                    preventDoubleClick(false);
                }
            }
        }
    }


    //IN PROGRESS
    const toBase64 = (e) => {

        let responseCont = document.getElementById('responseCont');
        responseCont.innerText = "";

        if (e.target.files[0]) {

            let fileObj;
            fileObj = e.target.files[0];

            //PREVENTS UNSPECIFIED EXTENSION FILESS
            if (!ExtValidator(fileObj)) {
                setErrorOrSuccess(prevState => !prevState === false && !prevState);
                responseCont.innerText = "Supported file types are gif, jpg, jpeg, png";
                return false;
            }

            setIsImgLoading(true);
            setSubmittable(false);
            let fileSize = parseInt(e.target.files[0].size / 1000);
            responseCont.innerHTML = '';
            
            if (fileSize > fs) {
                responseCont.innerHTML = '[Max FileSize: 1000KB], No file selected';
                setIsImgLoading(false);
                setSelectedFile('');
                setErrorOrSuccess(false);
                setSubmittable(true);
                return false;
            }
            setSubmittable(false);
            // get a reference to the file        
            const file = e.target.files[0];

            // encode the file using the FileReader API
            const reader = new FileReader();
            reader.onloadend = async () => {
                // use a regex to remove data url part
                let arr = base64Src;
                arr.push(reader.result);
                setBase64Src(arr);
                const base64String = reader.result;

                // log to console
                // logs wL2dvYWwgbW9yZ...
                setSelectedFile(base64String);
                let data = {
                    "image": base64String,
                    "folder": "post-images"
                };

                let obj = {
                    data: data,
                    token: "",
                    method: "post",
                    url: "uploadimage"
                }
                try {
                    const res = await fetchData(obj)
                    if (res.data.status === true) {
                        let arr = imgPathArr;
                        arr.push(res.data.imagepath);
                        setImgPathArr(arr);
                        setIsImgLoading(false);
                        setSubmittable(true);
                    }
                } catch {
                    console.log("some error occured");
                }
            };
            reader.readAsDataURL(file);
        };
    }
    //IN PROGRESS


    // const verifyRecaptcha = (value) => {
    //     setRecaptchaKey(value);

    //     setTimeout(() => {
    //         setRecaptchaKey("")
    //     }, 120000);
    // }


    // REMOVE UPLOADED IMAGE
    const removeImg = (indexToBeRemoved) => {
        setSubmittable(false);

        let base64SrcArr = base64Src.filter((elem, index) => {
            return index !== indexToBeRemoved && elem
        })

        let imgPathArrN = imgPathArr.filter((elem, index) => {
            return index !== indexToBeRemoved && elem
        })

        setBase64Src(base64SrcArr);
        setImgPathArr(imgPathArrN);

        setTimeout(() => {
            setSubmittable(true);
        }, 1200);
    }

    return (
        <div className="container-fluid">
            <div className="row outerContWrapper">
                {/* Adds Header Component  */}
                <Header links={true} fullWidth={true} />

                <div className="preventHeader">preventHead</div>

                <form className="col-12 p-0 m-0 bg-white createPostOuterCont">
                    <div className="container py-md-4 p-3 preventFooter">

                        <div className="row py-0 py-md-2 ">
                            <div className="col-12 createPostLogoCont">
                                <div className="createPostLeftHead">
                                    Write your confession or thought
                                </div>
                                <img src={createPostLogo} alt="" />
                            </div>
                        </div>


                        <div className="row py-0 py-md-2 createPostBoxShadow boxShadow">
                            <div className="uploadImgNPostCont">
                                <div className="writePostCreatePostTxt">
                                    <TextareaAutosize
                                        className="form-control createPostTextArea pt-3"
                                        defaultValue={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value)
                                        }}
                                        placeholder={"What’s REALLY on your mind?"}
                                        minRows="5"
                                        name="comments"
                                        id="textAreaDescription"
                                        maxLength={noOfChar}>
                                    </TextareaAutosize>
                                    <div className='maxCharCreatePost'>
                                        <span className="textAreaLimit">[ Max-Characters:{noOfChar} ]</span>
                                    </div>
                                </div>

                                <div className="cstmUploadFileCont">
                                    <label htmlFor="uploadImages" className="uploadImgWrapper">
                                        <img src={uploadImages} alt="" />
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="uploadImages"
                                        accept=".jpg, jpeg, .gif, .png"
                                        name="images"
                                        onChange={(e) => { toBase64(e) }}
                                    />
                                    <label htmlFor="uploadImages" className="createPostLabels">Upload Images if there are any</label>
                                </div>
                            </div>

                            <div className="imgNerrorWrapper">

                                {/* UPLOAD IMAGES MOBILE PREVIEW CONTAINER */}
                                {base64Src.length > 0 &&
                                    <div className="createPostImgPrev mobileView">
                                        <div className="form-group imgPreviewCont">
                                            <div className="imgContForPreviewImg">
                                                {base64Src.map((elem, index) => {
                                                    return (<span className="uploadeImgWrapper" key={"imgPreviewCont9" + index} value={index} onClick={() => { removeImg(index) }}>
                                                        <img src={elem.toString()} alt="" className='previewImg' />
                                                        <img src={removeImgIcon} alt="" className='removeImgIcon' type="button" />
                                                    </span>)
                                                })}

                                                {isImgLoading &&
                                                    <div className="imgLoader">
                                                        <div className="spinner-border pColor imgLoaderInner" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {/* END OF UPLOAD IMAGES MOBILE PREVIEW CONTAINER */}

                                <div className="w-100 errorFieldsCPost mb-2">
                                    <div className={`responseCont mt-0 ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="responseCont"></div>
                                    <span className="errorCont text-danger text-center" id="capthaErrorCont"></span>
                                    <span className="d-block errorCont text-danger" id="descErrorCont"></span>
                                    <span className="errorCont text-danger" id="catErrorCont"></span>
                                </div>

                            </div>


                            <div className="rightCreatePostUpperCont">
                                <div className="container-fluid rightMainCreatePostFormCont px-0">
                                    <div className="head">

                                        {/* <div className="recaptchaFeed text-right justify-content-center mb-2"> */}
                                        {/* {!auth() && <ReCAPTCHA
                                                sitekey="6LfOYpAeAAAAACg8L8vo8s7U1keZJwF_xrlfN-o9"
                                                onChange={verifyRecaptcha}
                                            />} */}
                                        {/* </div> */}


                                        <div className='exceptRecap'>

                                            <div className="form-group radioCont exceptRecapFields">
                                                <label htmlFor="TweightRadio" className="labelForToggle createPostLabels">Post as anonymous</label>
                                                <input
                                                    type="checkbox"
                                                    className="switch12"
                                                    id="TweightRadio"
                                                    onChange={(e) => { setAnonymous(e.target.checked) }}
                                                    defaultValue={anonymous ? 1 : 0}
                                                    checked={anonymous}
                                                    disabled={!auth() ? true : false} />
                                            </div>

                                            <div className="createPostInputs exceptRecapFields selectCategory">
                                                <select
                                                    className="form-control"
                                                    onChange={(e) => setSelectedCat(e.target.value)}
                                                    id="selectedCategory"
                                                    name="category">
                                                    <option value={""}>Select Category</option>

                                                    {/* Adds categories to the select box as options */}
                                                    {categories ? categories.map((element) => {
                                                        return <option key={`createPost ${element.id}`} value={element.id}>{(element.category_name).charAt(0) + (element.category_name).slice(1).toLowerCase()}</option>
                                                    }) : <option value="">Categories not found</option>}
                                                    {/* End of Adds categories to the select box as options */}

                                                </select>
                                                <img src={downArrowIcon} alt="" />
                                            </div>

                                            <button
                                                disabled={!submittable}
                                                id="postConfBtn"
                                                type="button"
                                                onClick={() => { validateFrom() }}
                                                className="btn doPostBtn exceptRecapFields">
                                                {isLoading ? <div className="spinnerSizePost spinner-border text-white" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div> : "Post"}</button>

                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* UPLOAD IMAGES PREVIEW CONTAINER */}
                        {base64Src.length > 0 &&
                            <div className="createPostImgPrev">
                                <div className="form-group imgPreviewCont">
                                    <div className="imgContForPreviewImg">
                                        {base64Src.map((elem, index) => {
                                            return (<span className="uploadeImgWrapper" key={"imgPreviewCont9" + index} value={index} onClick={() => { removeImg(index) }}>
                                                <img src={elem.toString()} alt="" className='previewImg' />
                                                <img src={removeImgIcon} alt="" className='removeImgIcon' type="button" />
                                            </span>)
                                        })}

                                        {isImgLoading &&
                                            <div className="imgLoader">
                                                <div className="spinner-border pColor imgLoaderInner" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>}
                                    </div>
                                </div>
                            </div>
                        }
                        {/* END OF UPLOAD IMAGES PREVIEW CONTAINER */}


                    </div>
                </form>
                {/* Adds Footer Component */}
                <Footer />
            </div>
        </div>
    );
}
