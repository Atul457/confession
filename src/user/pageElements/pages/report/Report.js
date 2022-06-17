import React, { useState, useEffect } from 'react';
import removeImgIcon from '../../../../images/removeImgIcon.png';
import uploadImages from '../../../../images/uploadImages.png';
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import downArrowIcon from '../../../../images/downArrow.png';
import auth from '../../../behindScenes/Auth/AuthCheck';
import { useNavigate } from "react-router-dom";
import { fetchData } from '../../../../commonApi';
// import ReCAPTCHA from 'react-google-recaptcha';
import ExtValidator from '../../../../extensionValidator/ExtValidator';
import contactUsLogo from '../../../../images/contactUsLogo.svg';
import TextareaAutosize from 'react-textarea-autosize';


export default function Report() {

    let history = useNavigate();
    const [reportReason, setReportReason] = useState(false);
    const [reportValue, setReportValue] = useState('');
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

    let fs = 1024; //SETS THE MAX FILE SIZE THAT CAN BE SENT


    //PREVENTS IMG DATA FROM BEING SENT EMPTY
    useEffect(() => {
        setSubmittable(true);
    }, [selectedFile])

    useEffect(() => {
        setReportReason([
            {
                id: 1,
                name: "Rude Behaviour"
            },
            {
                id: 2,
                name: "Communication Delay"
            },
            {
                id: 3,
                name: "Server Error"
            },
            {
                id: 4,
                name: "Language Problem"
            }
            ,
            {
                id: 5,
                name: "General enquiry"
            }
            ,
            {
                id: 6,
                name: "Request a Feature"
            }
        ]);    //Dummy 
    }, [])


    const preventDoubleClick = (runOrNot) => {
        if (document.querySelector('#postReportBtn')) {
            var elem = document.querySelector('#postReportBtn');
            runOrNot === true ? elem.classList.add("ptNull") : elem.classList.remove("ptNull");;
        }
    }


    async function validateFrom()     // Validates the form
    {
        preventDoubleClick(true);
        let loggedInUserData;
        let descErrorContR = document.getElementById('descErrorContR'), token = '';
        let reportErrorCont = document.getElementById('reportErrorCont');
        let responseContR = document.getElementById('responseContR');
        let capthaErrorContR = document.getElementById('capthaErrorContR');
        responseContR.innerHTML = '';
        capthaErrorContR.innerText = '';
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
            } else if (recapToken === '') {
                capthaErrorContR.innerText = "Recaptcha is required";
                preventDoubleClick(false);
                return false;
            }

            if (description.trim() === '') {
                descErrorContR.innerHTML = 'Report/Bug is a required field.';
                preventDoubleClick(false);
                return false;
            } else {
                descErrorContR.innerHTML = '';
            }
            if (reportValue.trim() === '') {
                reportErrorCont.innerHTML = 'Related problem is a required field.';
                preventDoubleClick(false);
                return false;
            }
            else {
                reportErrorCont.innerHTML = '';
                setIsLoading(true);
                let createReportArr = {
                    "message": description,
                    "related_issue": reportValue,
                    "image": JSON.stringify(imgPathArr),
                    "code": token === '' ? recapToken : ''
                };


                let obj = {
                    data: createReportArr,
                    token: token,
                    method: "post",
                    url: "postcomplains"
                }

                try {
                    const res = await fetchData(obj)
                    if (res.data.status === true) {
                        setErrorOrSuccess(true);
                        responseContR.innerHTML = res.data.message;
                        setTimeout(() => {
                            history("/home");
                        }, 2000);
                    } else {
                        setErrorOrSuccess(false);
                        responseContR.innerHTML = res.data.message;
                    }
                    setIsLoading(false);
                } catch {
                    setErrorOrSuccess(false);
                    setIsLoading(false);
                    responseContR.innerHTML = "Server Error, Please try again after some time...";
                }

                preventDoubleClick(false);
            }
        }
    }


    //in progress
    const toBase64 = (e) => {

        let responseCont = document.getElementById('capthaErrorContR');
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

            let responseContR = document.getElementById('responseContR');
            let fileSize = parseInt(e.target.files[0].size / 1000);
            responseContR.innerHTML = '';

            if (fileSize > fs) {
                responseContR.innerHTML = '[Max FileSize: 1000KB], No file selected';
                setSelectedFile('');
                setIsImgLoading(false);
                setErrorOrSuccess(false);
                setSubmittable(true);
                return false;
            }
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
                    folder: "misc"
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
                    } else {
                        setIsImgLoading(false);
                        setSubmittable(true);
                    }
                } catch {
                    console.log("Some error occured");
                }
            };
            reader.readAsDataURL(file);
        }
    };
    //in progress

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

    // const verifyRecaptcha = (value) => {
    //     setRecaptchaKey(value);

    //     setTimeout(() => {
    //         setRecaptchaKey("")
    //     }, 120000);
    // }

    return (
        <div className="container-fluid">
            <div className="row outerContWrapper">
                <Header links={true} fullWidth={true} />

                <div className="preventHeader">preventHead</div>

                <form className="col-12 p-0 m-0 bg-white createPostOuterCont">
                    <div className="container py-md-4 p-3 preventFooter">

                        <div className="row py-0 py-md-2 ">
                            <div className="col-12 createPostLogoCont">
                                <div className="createPostLeftHead">
                                    Report a problem or bug
                                </div>
                                <img src={contactUsLogo} alt="" />
                            </div>
                        </div>

                        <div className="row py-0 py-md-2 createPostBoxShadow boxShadow">
                            <div className="uploadImgNPostCont">
                                <div className="writePostCreatePostTxt">
                                    <TextareaAutosize className="form-control createPostTextArea pt-3"
                                        minRows="5" name="comments"
                                        defaultValue={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value)
                                        }}
                                        id="textAreaDescriptionR"
                                        maxLength={noOfChar}>
                                    </TextareaAutosize>
                                    <div className="maxCharCreatePost">
                                        <span className="textAreaLimit">
                                            [ Max-Characters:{noOfChar} ]
                                        </span>
                                    </div>
                                </div>

                                <div className="cstmUploadFileCont">
                                    <label htmlFor="uploadReportImages" className="uploadImgWrapper">
                                        <img src={uploadImages} alt="" />
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="uploadReportImages"
                                        name="images"
                                        accept=".jpeg, .png, .jpg, .gif"
                                        onChange={(e) => { toBase64(e) }}
                                    />
                                    <label htmlFor="uploadReportImages" className="createPostLabels">Upload Screenshots if there are any</label>
                                </div>
                            </div>

                            <div className="w-100 mt-3 errorFieldsCPost">
                                <span className="d-block errorCont text-danger mt-0" id="descErrorContR"></span>
                                <span className="d-block errorCont text-danger mt-0" id="reportErrorCont">
                                </span>
                                <div className={`responseCont mt-0 ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="responseContR"></div>
                                <span className="d-block errorCont text-danger text-center" id="capthaErrorContR"></span>
                            </div>

                            <div className="rightCreatePostUpperCont">
                                <div className="container-fluid rightMainCreatePostFormCont px-0">

                                    <div className="head">
                                        <div className="recaptchaFeed text-right justify-content-center mb-2">
                                            {/* {!auth() && <ReCAPTCHA
                                                sitekey="6LfOYpAeAAAAACg8L8vo8s7U1keZJwF_xrlfN-o9"
                                                onChange={verifyRecaptcha}
                                            />} */}
                                        </div>

                                        <div className='exceptRecap'>

                                            <div className="createPostInputs exceptRecapFields selectCategory">
                                                <select
                                                    className="form-control report"
                                                    id="relatedProblem"
                                                    name="report"
                                                    onChange={(e) => setReportValue(e.target.value)}>
                                                    <option value="">Select related problem</option>

                                                    {/* ADDS REPORT REASONS TO THE SELECT BOX AS OPTIONS */}
                                                    {reportReason ? reportReason.map((element) => {
                                                        return <option
                                                            className="text-capitalize"
                                                            key={`report${element.id}`}
                                                            value={element.name}>
                                                            {element.name}
                                                        </option>
                                                    }) : <option value="">Categories not found</option>}
                                                    {/* END OF REPORT REASONS TO THE SELECT BOX AS OPTIONS */}

                                                </select>
                                                <img src={downArrowIcon} alt="" />
                                            </div>

                                            <button
                                                id="postReportBtn"
                                                disabled={!submittable}
                                                type="button"
                                                onClick={() => { validateFrom() }}
                                                className="btn doPostBtn exceptRecapFields report">
                                                {isLoading ? <div className="spinnerSizePost spinner-border text-white" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div> : "Register Complain"}</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* UPLOADED IMAGES */}
                        {
                            base64Src.length > 0 &&
                            <div className="createPostImgPrev">
                                <div className="form-group imgPreviewCont">
                                    <div className="imgContForPreviewImg">
                                        {base64Src.map((elem, index) => {
                                            return (
                                                <span className="uploadeImgWrapper" key={"imgPreviewCont9" + index} value={index} onClick={() => { removeImg(index) }}>
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
                        {/* UPLOADED IMAGES */}

                    </div>
                </form>
                <Footer />
            </div>
        </div>
    );
}
