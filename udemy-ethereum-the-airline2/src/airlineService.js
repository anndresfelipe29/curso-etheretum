import contract from "truffle-contract";

export class AirlineService{
    constructor(contract){
        this.contract = contract;
    }
    // ver vuelos disponibles (para comprar)
    async getFlights(){        
        let total = await this.getTotalFlights();
        let flights = [];        
        for(var i=0; i<total;i++){
            let flight = await this.contract.flights(i);
            flights.push(flight);
        }
        return this.mapFlights(flights);
    }
    // ver vuelos comprados (un array)
    async getCustomerFlights(account){
        let customerTotalFlights = await this.contract.customerTotalFlights(account); // llega un big number
        let flights =[];
        for(var i = 0; i< customerTotalFlights.toNumber(); i++){
            let flight = await this.contract.customersFlights(account, i)
            flights.push(flight);
        }
        
        return this.mapFlights(flights);// Pasar tuplas a objeto melo
    }

    async getTotalFlights(){        
        return (await this.contract.totalFlights()).toNumber();
    }

    // devuelve ether ganado
    async getRefundableEther(from){
        return this.contract.getRefundableEther({from});
    }

    async redeemLoyaltyPoints(from){
        return this.contract.redeemLoyaltyPoints({from});
    }


    mapFlights(flights){
        return flights.map(flight =>{
            return{
                name: flight[0],
                price: flight[1].toNumber()
            }
        });
    }

    // comprar un vuelo
    async buyFlight(flightIndex, from, value){
        return this.contract.buyFlight(flightIndex, {from, value})
    }


}