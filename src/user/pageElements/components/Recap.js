import axios from 'axios';
import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha';


export default function Recap() {
    function onChange(value) {       
        const instance = axios.create({
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
            },
        });
        let data = {
            secret: "6LfOYpAeAAAAAFR8GZi8mHrrMK6kb885JUTJ1fbM",
            response: value
        }

        instance.post("https://www.google.com/recaptcha/api/siteverify",data).then((res)=>{
            // console.log(res);
        }).catch((err)=>{
            console.log(err);
        })
    }
    
  return (
      <div className="App">
          <ReCAPTCHA
              sitekey="6LfOYpAeAAAAACg8L8vo8s7U1keZJwF_xrlfN-o9"
              onChange={onChange}
          />
      </div>
  )
}
