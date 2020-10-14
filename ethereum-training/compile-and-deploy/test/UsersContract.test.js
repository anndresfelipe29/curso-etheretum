const assert = require('assert'); //viene de Chai
const AssertionError = require('assert').AssertionError;
const Web3 = require('web3');

//conexion con la blockchain de prueba (ganache)
const provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');
//instancia o ejemplificación de web 3
const web3 = new Web3(provider);

const contrato = require('../scripts/compile');

const interface_abi = contrato.contracts['UsersContract.sol']['UserContract'].abi;
const bytecode = contrato.contracts['UsersContract.sol']['UserContract'].evm.bytecode.object;

console.log(interface_abi);
let accounts;
let usersContract;

//obtenemos las cuentas de la blockchain y despues desplegamos el contrato desde la primera cuenta obtenida
beforeEach(async()=> {
    console.log('entra al before each')
    accounts = await web3.eth.getAccounts();
    usersContract = await new web3.eth.Contract(interface_abi).deploy({data:bytecode}).send({from: accounts[0] , gas: '1000000'});
} );
// send para transacciones y call para operaciones de lectura o metodos view
describe('bloque 1 de pruebas a smart contract' , async() => {

    it('Prueba 1: verificar cuenta', () => {
        console.log('direccion', usersContract.options.address);
        assert.ok(usersContract.options.address);
    });

    it('Prueba 2: Agregar usuario a contrato', async()=> {
        await usersContract.methods.join( 'pipe', 'gomez').send( {from:accounts[0] , gas:'500000'} );

    });

    it('Prueba 3: recuperar un usuario' , async()=> {
        let name= 'pipe';
        let surName= 'gomez';
        console.log(name);
        await usersContract.methods.join( name, surName).send( {from:accounts[0] , gas:'500000'} );
        let user = await usersContract.methods.getUser( accounts[0]).call();
        await console.log('usuario: ', user[0]);
        assert.equal(name ,user[0] );
        assert.equal(surName , user[1]);
    });

    it('prueba 4: ver usuarios registrados', async()=> {
        let name= 'pipe';
        let surName= 'gomez';
        console.log(name);
        await usersContract.methods.join( name, surName).send( {from:accounts[0] , gas:'500000'} );
        let cantidad = await usersContract.methods.totalUsers().call();
        await console.log('total de personas en el contrato: ', cantidad);
    });

    it('Prueba 5: no permitir usuarios repetidos' , async()=> {
        let name= 'pipe';
        let surName= 'gomez';
        console.log(name);
        await usersContract.methods.join( name, surName).send( {from:accounts[0] , gas:'500000'} );
        try{
            await usersContract.methods.join( name, surName).send( {from:accounts[0] , gas:'500000'} );
            assert.fail('La cuenta no puede estar dos veces registrada');
        }catch(e){
            if( e instanceof AssertionError){
                assert.fail(e.message);
            }
        }
        
    });

    it('Prueba 6: Usuario no registrado', async() => {
        try{
            let user = await usersContract.methods.getUser( accounts[0]).call();
            assert.fail('deberia fallar si el usuario no esta registrado en el contrato');
        }catch(e){
            console.log('El error es: ',e.message);
            if(e instanceof AssertionError){
                assert.fail(e.message);
            }
        }

        

    })


});
