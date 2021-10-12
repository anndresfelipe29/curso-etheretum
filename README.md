# Curso Ethereum y smarts contracts en solidity

## comando truffle
Permite ver lo contratos desplegados en la red
truffle networks
Muestra la dirección de las migraciones
Migrations.address

## Consola de truffle

Se entra a la consola con truffle console

Comandos para usar en la consola truffle interesantes:

- Guarda en un avaliable todas las cuentas de la red blockchain:
 ' const accounts = await web3.eth.getAccounts() '
o 
'web3.eth.getAccounts((e,r) => {cuentas=r})'

- Ver el número del ultimo bloque creado en la red:
(await web3.eth.getBlockNumber()).toString()

- Ver la cantidad de Gwei (1 gwei es  0,000000001 Ether) que tiene una cuenta:
web3.eth.getBalance(accounts[0])

- Ver la cantidad de ether en una cuenta en ether:
web3.eth.getBalance(accounts[0]).then(result => web3.utils.fromWei(result,"ether"))

-Realizar una transaccion con web 3 :
web3.eth.sendTransaction({from: accounts[0], to:accounts[1], value: web3.utils.toWei("15", 'ether')});

- Ver información de una transacción (el hash corresponse al de la transacción):
web3.eth.getTransaction('0x9bc82ef71c0d957641d2f662fe3698aff828d6eb01d6b48e36f5663a3b80624e')

- Ver informacion de una transacción con otra información:
web3.eth.getTransactionReceipt('0x9bc82ef71c0d957641d2f662fe3698aff828d6eb01d6b48e36f5663a3b80624e')

### Interacción con contratos desde consola

- Trae toda la información del contrato desplegado
nombreDelContratoOMigración.deployed() 
Por ejemplo
Migrations.deployed()
- Guardar una instancia de un contrato en una variable por medio de una promesa
Migrations.deployed().then(c=> instance=c)

- Llamar una variable de un contrato
instance.last_completed_migration.call()
 
 #### Ejemplo especifíco con el contrato user
- Comando para llamar un metodo desde una cuenta especifica y con un limite de gas definido:
 instance.join("Felipe", "Gomez",{from: accounts[1], gas:120000})

- Comando para llamar un método abierto (tipo view) que no requiere de una cuenta
 instance.totalUsers()

### Ejemplo especifíco contrato aerolinea 

instance.totalFlights.call()

instance.flights(0)

### Metamask y front

Si se tiene metamask se puede usar web3 desde el navegador web

para conectar la pagina web con metamask se usa:
 

 ' ethereum.enable() '