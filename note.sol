pragma solidity ^0.4.4;

contract Pass{
    mapping(address => bool) ownership;
    mapping(address => string) notes;
    
    constructor(address genesis) public {
        ownership[genesis] = true; //this address starts with it
    }
    
    function checkOwnership(address p) public view returns(bool){
        if(ownership[p]){
            return true;
        }
        return false;
    }
    
    function sign(string signedNote) public returns(uint){ // 1 on success 0 on fail
        if(checkOwnership(msg.sender)){ //if msg.sender owns the note
            notes[msg.sender] = signedNote;
            return 1;
        }
        return 0;
    }
    
    function pass(address recipient) public returns(uint){ // 1 on success 0 on fail
        if(checkOwnership(msg.sender)){ //if msg.sender owns the note
            ownership[msg.sender] = 0;
            ownership[recipient] = 1;
            return 1;
        }
        return 0;
    }
    
    function viewNotes(address participant) public returns(string){ // signed note on success nothing on fail
        if(notes[participant] !== 0){
            return (notes(participant));   
        }
    }

    
}
