import React from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import { GetComplaintsData } from '../datatable/GetComplaintsData';
import auth from '../behindScenes/Auth/AuthCheck';

export const Complaints = () => {

    if (!auth()) {
        window.location.href = "/talkplacepanel"
    }

    return (
        <div className="container-fluid">
            {auth() &&
            <div className="row">
                <Header links={true} />
                <div className="preventHeader">preventHead</div>
                <div className="container py-md-4 px-md-5 p-3 preventFooter">
                    <div className="row forPosSticky">
                        <section className="col-lg-12 col-12 mt-3 mt-lg-0 boxShadow">
                            <div className="adminUsersPageHead">
                                <h6 className="mb-0">Complaints</h6>
                            </div>
                            <GetComplaintsData />
                        </section>  
                    </div>
                </div>
                <Footer />
            </div>}
        </div>
    )
}