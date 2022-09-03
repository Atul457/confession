import React from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import auth from '../behindScenes/Auth/AuthCheck';
import { Link } from 'react-router-dom';
import { GetReportedCommentsData } from '../datatable/GetReportedCom';


export const ReportedComments = () => {

    if (!auth()) {
        window.location.href = "/talkplacepanel"
    }

    return (
        <div className="container-fluid">
            {auth() &&
                <div className="row">
                    <Header links={true} fullWidth={true} />
                    <div className="preventHeader">preventHead</div>
                    <div className="container py-md-4 px-md-5 p-3 preventFooter">
                        <div className="row forPosSticky">
                            <Link to="/dashboard" className='backtoHome'>
                                <i className="fa fa-arrow-left mr-2" aria-hidden="true"></i>
                                Back to home
                            </Link>
                            <section className="col-lg-12 col-12 mt-3 mt-lg-0 boxShadow">
                                <div className="adminUsersPageHead">
                                    <h6 className="mb-0">Reported Comments</h6>
                                </div>
                                <GetReportedCommentsData />
                            </section>
                        </div>
                    </div>
                    <Footer />
                </div>}
        </div>
    )
}
