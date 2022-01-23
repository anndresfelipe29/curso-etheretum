import Web3 from 'web3';
import {resolve} from 'path';
const getWeb3 = ()=>{
    return new Promise( (resolve, reject)=> {
        window-addEventListener('load', function(){
            let web3 = this.window.web3;  // se almacena la version de web3 en el navegador
            // se puede cambiar por window.ethereum

            if(typeof web3 !== undefined){
                // se encuentra metamask instalado en el navegador, probablemente porque está instalado metamask   
                web3 = new Web3(web3.currentProvider);
                resolve(web3);
            }else{
                console.error("No hay un proveedor, instale metamask");
                reject();
            }
        })
    } );
};
export default getWeb3;