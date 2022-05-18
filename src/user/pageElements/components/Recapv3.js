import React, { useEffect } from 'react'

const Recapv3 = () => {

    useEffect(() => {
        const loadScriptByURL = (id, url, callback) => {
            const isScriptExist = document.getElementById(id);

            if (!isScriptExist) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                script.id = id;
                script.onload = function () {
                    if (callback) callback();
                };
                document.body.appendChild(script);
            }

            if (isScriptExist && callback) callback();
        }

        // load the script by passing the URL
        loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=6LcFvPEfAAAAAL7pDU8PGSIvTJfysBDrXlBRMWgt`, function () {
            console.log("Script loaded!");
        });
        

    }, []);

   


    const captachaValid = async () => {
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute("6LcFvPEfAAAAAL7pDU8PGSIvTJfysBDrXlBRMWgt", { action: 'submit' }).then(token => {
                console.log(token)
            });
        });
    }

    return (
        <div>
            <button onClick={captachaValid}>validate</button>
        </div>
    )
}

export default Recapv3;