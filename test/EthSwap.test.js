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

contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap

    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
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

    describe('buyTokens()', async () => {
        let result

        before(async () => {
            //Purchase 1 ether from investor account
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether') })
            
        })

        it('Allows user to instantly purchase tokens from ethSwap fo fixed rate', async () =>{
            //Check ivestor token balance after purchase

            let investorBalance = await token.balanceOf(investor)

            //Check investor token balance after purchase
            assert.equal(investorBalance.toString(), tokens('100'))

            //Check ethSwap token balance after purchase
            let ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))

            //Check ethSwap ethereum balance after purchase
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'))
            
            //Event check if it has the correct data
            const event = result.logs[0].args
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100').toString());
            assert.equal(event.rate.toString(), '100');
        })
    })

    describe('sellTokens()', async () => {
        let result

        before(async () => {
            //The investor must approve the purchase
            await token.approve(ethSwap.address, tokens('100'), { from: investor })
            result = await ethSwap.sellTokens(tokens('100'), {from: investor})
        })

        it('Allows user to instantly sell tokens to ethSwap for a fixed price', async() =>{
            let investorBalance = await token.balanceOf(investor)

            //Check investor token balance after purchase
            assert.equal(investorBalance.toString(), tokens('0'))

            //Check ethSwap token balance after purchase
            let ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('1000000'))

            //Check ethSwap ethereum balance after purchase
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'ether'))

            //Event check if it has the correct data
            const event = result.logs[0].args
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100').toString());
            assert.equal(event.rate.toString(), '100');
        
            //FAILURE: Investor cannot sell more tokens than they have
            await ethSwap.sellTokens(tokens('500'),{from: investor}).should.be.rejected;
        })
    })
})