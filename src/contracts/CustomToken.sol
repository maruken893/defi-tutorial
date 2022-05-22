pragma solidity ^0.5.0;

contract CustomToken {
  string public name = "Custom Token";
  string public symbol = "CUS";
  uint256 public totalSupply = 100000000000000000000000000;
  uint8 public decimal = 18;
  uint excuteNum = 0;

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  function transfer(address _to, uint256 _value) public returns(bool success) {
    require(balanceOf[msg.sender] >= _value);
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    excuteNum++;
    return true;
  }

  function approve(address _spender, uint256 _value) public returns(bool success) {
    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    excuteNum++;
    return true;
  }

}