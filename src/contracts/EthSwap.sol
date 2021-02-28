pragma solidity >=0.4.17;

import "./Token.sol";

contract EthSwap{
    string public name = "EthSwap Instant Exchange";

    //Object for Token Smart Contract
    Token public token;
    uint public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        //Buys Dapp Tokens for Ether

        //Redemption rate = # of tokens to swap for 1 ether
        //Amount of Ethereum * Redemption Rate
        uint tokenAmount = rate * msg.value;

        //Requires EthSwap has enough tokens for the transaction
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);

        //Emit on event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        //Sells Ether for our tokens

        //Calculate the amount of ether to redeem for the given dapp tokens
        uint etherAmount = _amount / rate;

        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);
    }
}

