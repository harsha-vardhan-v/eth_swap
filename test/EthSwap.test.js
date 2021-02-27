const { assert } = require('chai');
const { default: Web3 } = require('web3');

const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap');

require('chai')
    .use(require('chai-as-promised'))
    .should()

//For converting human readable tokens to wei tokens
function tokens(n){
    //Utitlity converts human readable number to wei tokens * 10^18
    return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', (accounts) => {
    let token, ethSwap

    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new()
        //Transfer all 1 million tokens to EthSwap
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    describe('Token deployment', async () => {
        it('contract has a name', async () => { 
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
    })
    
    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('contract has tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance, tokens('1000000'));
            
        })
    })
})