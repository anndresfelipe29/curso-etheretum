pragma solidity >=0.4.22 <0.9.0;

contract Airline {
    address public owner;

    struct Customer {
        uint256 loyaltyPoints;
        uint256 totalFlights;
    }

    struct Flight {
        string name;
        uint256 price;
    }

    //las variables globales son las que se guardan en persistencia

    uint etherPerPoint = 0.5 ether;

    Flight[] public flights;
    mapping(address => Customer) public customers;
    mapping(address => Flight[]) public customersFlights;
    mapping(address => uint256) public customerTotalFlights;

    // envia una respuesta a un usuario, como un mensaje al parecer
    event FlightPurchased(address indexed customer, uint256 price);

    constructor() public {
        owner = msg.sender;
        flights.push(Flight("Tokio", 4 ether));
        flights.push(Flight("Alemania", 3 ether));
        flights.push(Flight("Madrid", 3 ether));
    }

    // el payable se usa con las funciones que reciben dinero
    function buyFlight(uint256 flightIndex) public payable {
        Flight memory flight = flights[flightIndex];
        require(msg.value == flight.price);
        //El storage hace que la variable apunte al mismo espacio de memoria que el mapping por lo tanto se guarda en persistencia
        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.totalFlights += 1;

        customersFlights[msg.sender].push(flight);
        //creo que no esta sumando se queda en 1 siempre o falla mi logica
        customerTotalFlights[msg.sender]++;

        emit FlightPurchased(msg.sender, flight.price);
    }

    function totalFlights() public view returns (uint256) {
        return flights.length;
    }

    function redeemLoyaltyPoints() public{
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        //payable(msg.sender).transfer(etherToRefund);
        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints =0;
        
    }

    function getRefundableEther() public view returns(uint){        
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }

    function getAirlineBalance() public isOwner view returns (uint){    
        // address(this) obtiene la dirección del contrato    
        address airlineAddress = address(this);
        return airlineAddress.balance; // balance devuelve el saldo de una cuenta
    }

    // son funciones que se pueden insertar en otra para cumplir con x caracteristica
    modifier isOwner(){
        require(msg.sender == owner);
        _; // acá se ejecuta la función
    }





}
