import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import APIService from '../API/APIService';


const Download = () => {

    const [CID, setCID] = useState("");
    const [link, setLink] = useState("");
    const [data, setData] = useState([]);

    const API = new APIService();

    const handleSubmit = (event) => {
        event.preventDefault();
        const ipfsW3GW = "https://crustipfs.xyz";
        const link_ = '' + ipfsW3GW + '/ipfs/' + CID;
        setLink(link_);
    };


    return (
        <div className='row m-5'>
            <div className='col-4'></div>

            <div className='col-4'>
                <form onSubmit={handleSubmit}>
                    {/* CID Input */}
                    <div className="form-outline mb-4">
                        <input type="text" name='private' className="form-control"
                            placeholder='CID' value={CID} onChange={(e) => setCID(e.target.value)} />
                    </div>

                    {/* Submit button */}
                    <button type="submit" className="btn btn-primary btn-block">
                        Download Files
                    </button>
                </form>

                <div className='m-5'>
                    <a href={link}>
                        <button className='btn btn-primary btn-block'>
                            Go to File.
                        </button>
                    </a>
                    <QRCode value={link} style={{ marginRight: 50 }} />
                </div>

            </div>

            <div className='col-4'></div>

        </div>
    )
}

export default Download