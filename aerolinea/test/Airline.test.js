/**
 * Se hacen test con truffle, quiza esto vaya en el front
 */

const Airline = artifacts.require('Airline');

let instance;

beforeEach(async ()=> {
    //Airline.deployed()  o
    instance = await Airline.new()
} );

contract('Airline', account => {
    it('deberia tener vuelos disponibles', async() =>{
        let total = await instance.totalFlights();
        console.log(total);
        assert(total>0);
    })

    it('El contrato airline debe dar un vuelo si el cliente lo paga', async()=>{
        let flight = await instance.flights(0);
        //asi se reciben los maps desde ethereum
        let flightName = flight[0], price = flight[1];
        // console.log(flight);
        // console.log("Otro dato ------------");
        // console.log(flightName, " ++++", price);
        await instance.buyFlight(0, {from: account[0], value: price})
        let customerFlight = await instance.customersFlights(account[0], 0);//el segundo 0 es para traer la primera posicion del arreglo interno del map
        let customerTotalFlight= await instance.customerTotalFlights(account[0]);
        console.log("Total de vuelos: ",customerTotalFlight);

        assert(customerFlight[0], flightName);
        assert(customerFlight[1], price);
        assert(customerTotalFlight, 1);
    })

    it('Si no se da el ether correcto debe fallar la venta', async()=>{
        let flight = await instance.flights(0);
        let flightName = flight[0], price = flight[1]-5000;
        console.log(flight[1],' Precio: ',price);
        try{
            await instance.buyFlight(0, {from: account[0], value: price})
        }
        catch(e){
            return;
        }
        assert.fail();
    })

    it('Balance del contrato', async()=>{
        let flight1 = await instance.flights(0);
        let price1 =  flight1[1];
        let flight2 = await instance.flights(1);
        let price2 =  flight2[1];

        await instance.buyFlight(0, {from: account[1], value: price1});
        await instance.buyFlight(1, {from: account[1], value: price2});

        let balance = await instance.getAirlineBalance({from : account[9]});
        console.log("El balance es: ", balance, "   " );
        console.log(BigInt(balance));
        console.log(BigInt(price1));
        //BigInt(balance)
        //assert.equal(balance.toNumber(), price1.toNumber()+ price1.toNumber() );
        assert.equal(BigInt(balance), BigInt(price1)+ BigInt(price2) );

    })

    it('Redimir millas loyalty Points', async()=>{
        let flight = await instance.flights(1);
        let price = flight[1];

        await instance.buyFlight(1, {from: account[2], value:price});

        let balance = await web3.eth.getBalance(account[2]);

        let balanceAirline = await instance.getAirlineBalance({from : account[9]});
        console.log("El balance de aerolinea es: ", balanceAirline, "   " );

        console.log("Balance inicial: ",balance)
        await instance.redeemLoyaltyPoints({from: account[2]});
        let finalBalance = await web3.eth.getBalance(account[2]);

        let customer = await instance.customers(account[2]);
        let loyaltyPoints = customer[2];
        
        assert(loyaltyPoints,0);
        assert(finalBalance > balance)

        })

})