import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import APIService from '../API/APIService';

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";


const FileInput = () => {

    const API = new APIService();
    
    const [key, setKey] = useState("");
    const [keyPass, setKeyPass] = useState("");
    const [name, setName] = useState("");

    const [CID, setCID] = useState("CID has not been generated yet");

    const {register, handleSubmit} = useForm();

    useEffect(() => {
      console.log(CID);
    }, [CID])
    

    const onSubmit = (data) => {
        // 0xE3bc1Fa44b36B4c236B947343356dd45fC2ae2F8
        
        //console.log(data);
        //console.log(key);
        //console.log(keyPass);
        //console.log(name);
        
        let cid, size = 0;
        const res = API.addFileAuth(data, key, name, setCID).then(result => [cid, size]).then(API.placeStorageOrder(cid, size, keyPass));
        //console.log(cid, size);
        //const res = await API.placeStorageOrder(cid, size, keyPass);
    };
  
    return (
        <div className='row m-5'>
            <div className='col-4'></div>

            <div className='col-4'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Ethereum Private key input */}
                    <div className="form-outline mb-4">
                        <input type="text" name='private' className="form-control" 
                        placeholder='Ethereum Private Key' value={key} onChange={(e) => setKey(e.target.value)}/>
                    </div>
                    <div className="form-outline mb-4">
                        <input type="password" name='privatePass' className="form-control" 
                        placeholder='Ethereum Private Key mnemonic' 
                        value={keyPass} onChange={(e) => setKeyPass(e.target.value)}/>
                    </div>
                    {/* File name input */}
                    <div className="form-outline mb-4">
                        <input type="text" name='filename' className="form-control" 
                        placeholder='File Name' 
                        value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    {/* File input */}
                    <div className="form-outline mb-4">
                        <input type="file" name='file' className="form-control" 
                        placeholder='Choose File' {...register("fileData")}/>
                    </div>
                    {/* Submit button */}
                    <button type="submit" className="btn btn-primary btn-block">
                        Upload Document
                    </button>
                </form>
            </div>

            <div className='m-5'>
                <p>{CID}</p>
            </div>

            <div className='col-4'></div>
        </div>
    )

    /*

    let fileReader;
  
    const handleFileRead = (e) => {
      const content = fileReader.result;
      console.log(content)
      // … do something with the 'content' …
    }
    
    const handleFileChosen = (file) => {
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      console.log(file);
      fileReader.readAsText(file);
    }

    */
}

export default FileInput