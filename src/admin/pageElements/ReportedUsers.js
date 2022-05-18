import React from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import { GetReportsData } from '../datatable/GetReportsData';
import auth from '../behindScenes/Auth/AuthCheck';

export const ReportedUsers = () => {

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
                                <h6 className="mb-0">Reported Users</h6>
                            </div>
                            <GetReportsData />
                        </section>
                    </div>
                </div>
                <Footer />
            </div>}
        </div>
    )
}
