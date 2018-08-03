pragma solidity ^0.4.4;

contract Logistics{
    
    address public owner;
    mapping(address => string) notes;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor(address genesis) public {
       owner = genesis;
    }
    
    function sign(string signedNote) public onlyOwner{
            notes[owner] = signedNote; //gaurenteed that msg.sender == owner
    }
    
    function transferOwnership(address nuOwner) onlyOwner {
        owner = nuOwner;
    }

    function viewNotes(address participant) public returns(string){ // signed note on success nothing on fail
        if(notes[participant] !== 0){
            return (notes(participant));   
        }
    }

}
