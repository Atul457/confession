import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Card, Image } from 'react-bootstrap';
// import '../App.css';

export default function FbLogin() {
    const [login, setLogin] = useState(false);
    const [data, setData] = useState({});
    const [picture, setPicture] = useState('');

    const responseFacebook = (response) => {
        if (response.accessToken) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }

    return (
        <div className="container">
            <Card style={{ width: '600px', margin: '0 auto', textAlign: 'center' }}>
                <Card.Header>
                    {!login &&
                        <FacebookLogin
                        appId="350064407020433"
                            autoLoad={true}
                            fields="name,email,picture"
                            scope="public_profile,user_friends"
                            componentClicked={false}
                            callback={responseFacebook}
                            icon="fa-facebook" />
                    }
                    {login &&
                        <Image src={picture} roundedCircle />
                    }
                </Card.Header>
                {login &&
                    <Card.Body>
                        <Card.Title>{data.name}</Card.Title>
                        <Card.Text>
                            {data.email}
                        </Card.Text>
                    </Card.Body>
                }
            </Card>
        </div>
    );
}
