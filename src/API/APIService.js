import { Buffer } from 'buffer';
import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundleForPolkadot, crustTypes } from "@crustio/type-definitions";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair } from "@polkadot/keyring/types";

const { waitReady } = require("@polkadot/wasm-crypto");

const ipfsClient = require("ipfs-http-client");
const ethers = require("ethers");

const crustChainEndpoint = "wss://rpc.crust.network";
const Wsprovider = new WsProvider(crustChainEndpoint);
const api = new ApiPromise({
    provider: Wsprovider,
    typesBundle: typesBundleForPolkadot,
});

class APIService {

    async addFileAuth(file, key, file_name, setCID) {
        const pair = new ethers.Wallet(key);
        // console.log(pair);
        const sig = await pair.signMessage(pair.address);
        // console.log(sig);
        const authHeaderRaw = `eth-${pair.address}:${sig}`;
        // console.log(authHeaderRaw);
        const authHeader = Buffer.from(authHeaderRaw).toString("base64");
        // console.log(authHeader);
        const ipfsW3GW = "https://crustipfs.xyz";

        const fileBuffer = file['fileData']['0'];

        // console.log("line 21");

        const ipfs = ipfsClient.create({
            url: `${ipfsW3GW}/api/v0`,
            headers: {
                authorization: `Basic ${authHeader}`,
            },
        });

        // console.log("line 30");

        const file_path = "files/" + file_name;
        // // 2. Add file to ipfs
        // console.log(file_path);
        const { cid } = await ipfs.add({
            path: file_path,
            content: fileBuffer,
        });
        console.log("CID: ", cid);
        setCID(cid['_baseCache'].get('z'));

        // // 3. Get file status from ipfs
        const fileStat = await ipfs.files.stat("/ipfs/" + cid);
        // console.log("FILESTAT: ", fileStat);

        return [fileStat.cid['_baseCache'].get('z'), fileStat.cumulativeSize];
    }


    async placeStorageOrder(cid, size, password) {
        // 1. Construct place-storage-order tx
        const fileCid = cid; // IPFS CID, take `Qm123` as example
        const fileSize = size; // Let's say 2 gb(in byte)
        const tips = 0;
        const memo = "";
        const tx = api.tx.market.placeStorageOrder(fileCid, fileSize, tips, memo);

        const keyring = new Keyring({ type: "sr25519" });
        // console.log(keyring);
        const krp = keyring.addFromUri(
            password
        );
        // console.log(krp);

        await api.isReadyOrError;
        return new Promise((resolve, reject) => {
            // console.log(resolve, reject);
            tx.signAndSend(krp, ({ events = [], status }) => {
                console.log(`💸  Tx status: ${status.type}, nonce: ${tx.nonce}`);

                if (status.isInBlock) {
                    events.forEach(({ event: { method, section } }) => {
                        if (method === "ExtrinsicSuccess") {
                            console.log(`✅  Place storage order success!`);
                            resolve(true);
                        }
                    });
                } else {
                    // Pass it
                }
            }).catch((e) => {
                reject(e);
            });
        });

        // 3. Send transaction
    }


}

export default APIService