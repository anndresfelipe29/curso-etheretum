import AirlineContract from '../contracts/Airline.json';
import * as fs from 'fs';
// carga el json gracias a webpack 
//import contract from '@truffle/contract';
//const contract = require('@truffle/contract')
const contract = require('truffle-contract')

// retorna un objeto que representa el contrato que usaremos de la blockchain
// en el provider indicamos que trabaja con metamask
export default async(provider) =>{
    // armo el contrato a partir del json
    const airline = contract(AirlineContract);
    airline.setProvider(provider);

    // se crea ejemplificacion del contrato
    let instance= await airline.deployed(); 
    return instance;
}



