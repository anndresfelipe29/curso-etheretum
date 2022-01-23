import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";
import ethEnabled from "./ethEnabled";
import AirlineContract from "./airline";
import { AirlineService } from "./airlineService";
import { ToastContainer } from "react-toastr";

const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value, "ether");
    }

}


export class App extends Component {

    constructor(props) {
        super(props);
        // guardo la cuenta blockchain para usar en todo lado
        this.state = {
            account: undefined,
            balance: 0,
            flights: [],
            customerFlights: [],
            loyaltyPoints: 0
        }
    }



    // es como el on init de angular
    async componentDidMount() {
        // se trae objeto web 3
        this.web3 = await getWeb3();
        this.toEther = converter(this.web3);

        console.log('La version es: ' + this.web3.version)

        // Solicito permiso para conectar dapp con metamask
        await window.ethereum.send('eth_requestAccounts');

        // obtengo la cuenta blockchain que usa metmask 
        var account = (await ethereum.request({ method: 'eth_accounts' }));
        // var account =(await this.web3.eth.getAccounts())[0];            
        console.log('Cuentas: ' + account);

        // crea un objeto del contrato
        this.airline = await AirlineContract(this.web3.currentProvider);
        // console.log('Tiene el contrato el metodo comprar vuelo? '+this.airline.buyFlight);

        ///////////////////////////////////////77
        //subscripción a un evento
        console.log("1!")
        let flightPurchased = this.airline.FlightPurchased();
        console.log("2!")
        flightPurchased.watch((err, result) => {
            if (err) {
                console.log("errorr: " + err)
            } else {
                console.log(result)
                const { customer, price, flight } = result.args;
                if (customer === this.state.account) {                   
                    console.log("entro al evento. Se ha comprado un boleto a " + price + "con destino a " + flight);
                    this.container.success("Has comprado un vuelo a " + flight + " papu ");                 
                }else{
                    this.container.success("Se ha vendido un vuelo a " + flight + " papu ");   
                }
            }

        });
        //////////////////////////////////////

        // poder recargar el valor de la cantidad de ethers en una cuenta, al ser cambiada en ethereum
        // https://docs.metamask.io/guide/ethereum-provider.html#events
        window.ethereum.on('accountsChanged', (accounts) => {
            // Time to reload your interface with accounts[0]!
            this.setState({
                account: accounts[0].toLowerCase()
            }, () => {
                this.load();
            });
        })

        this.setState({
            account: account[0].toLowerCase()
        }, () => {
            this.load();
        });
        console.log('Balance1: ', this.state.balance);

        // instancia del servicio airlineService para poder interactuar con el contrato
        this.airlineService = new AirlineService(this.airline)
    }

    // crea instancia de smart contract
    async load() {
        //truffle contract libreria
        await this.getBalance();
        await this.getFlights();
        await this.getCustomerFlights();
        await this.getRefundableEther();

    }

    async getBalance() {
        console.log("----------------------")
        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        let ethBalance = await this.web3.eth.getBalance(this.state.account).then(result => this.web3.utils.fromWei(result, "ether"));
        this.setState({
            balance: this.toEther(weiBalance)
        });
        console.log('Balance2: ', weiBalance);
    }

    async getFlights() {
        console.log("entro")
        let flights = await this.airlineService.getFlights();
        console.log("vuelos: " + flights)
        this.setState({
            flights
        });
    }

    async getCustomerFlights() {
        let customerFlights = await this.airlineService.getCustomerFlights(this.state.account)
        this.setState({
            customerFlights
        })
    }

    async getRefundableEther() {
        let loyaltyPoints = (await this.airlineService.getRefundableEther(this.state.account));
        loyaltyPoints = this.toEther(loyaltyPoints.toString())
        console.log("loyalty points: " + loyaltyPoints)
        this.setState({
            loyaltyPoints
        })
    }

    async getRedeemLoyaltyPoints() {
        let redeemPoints = await this.airlineService.redeemLoyaltyPoints(this.state.account);
        this.load();
    }

    async buyFlight(flightIndex, flight) {
        console.log(flightIndex);
        console.log(flight.name);
        this.airlineService.buyFlight(flightIndex, this.state.account, flight.price)
    }
    pipe(){
        alert("zonas")
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>
            <button className="btn btn-sm" onClick={() => this.pipe()}> prueba</button>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">
                        <p>{this.state.account}</p>
                        <span> <strong> Balance: </strong> {this.state.balance}</span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">
                        <p>{this.state.loyaltyPoints} eth</p>
                        <button className="btn btn-sm" onClick={() => this.getRedeemLoyaltyPoints()}> Redimir millas</button>
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                        {this.state.flights.map((flight, i) => {

                            return <div key={i}>
                                <span> {flight.name} - Costo: {flight.price}</span>
                                <button className="btn btn-sm" onClick={() => this.buyFlight(i, flight)}>Comprar</button>
                            </div>
                        })}

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">
                        {this.state.customerFlights.map((flight, i) => {
                            return <div key={i}>
                                <span> {flight.name} - Costo: {flight.price}</span>
                            </div>
                        })}
                    </Panel>
                </div>
            </div>

            <ToastContainer ref={(input) => this.container = input}
                className="toast-top-right" />
        </React.Fragment>
    }
}