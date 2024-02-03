// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UserData {
    // User data structure
    uint counter = 10;

    struct Pair {
        string fileId;
        address requester;
    }

    struct User {
        uint id; //user Id
        string[] fileIds;
        mapping(string => string) jsonData; // Mapping to store JSON data
        mapping(string => address[]) fileToSignRequestAddresses; // whom i have requested
        Pair[] signRequesters;
    }

    // Mapping to associate Ethereum addresses with user data
    mapping(address => User) private users;

    // Event emitted when data is updated
    event DataUpdated(address indexed user, string key, string newData);

    // Event emitted when a new user is added
    event NewUserAdded(address indexed newUser);

    // Event emitted when a user is deleted
    event UserDeleted(address indexed deletedUser);

    // Function to store or update JSON data
    function updateData(string memory key, string memory newData) external {
        if(users[msg.sender].id == 0){
            users[msg.sender].id = counter;
            counter = counter + 1;
        }
        if(bytes(users[msg.sender].jsonData[key]).length == 0){
            users[msg.sender].fileIds.push(key);
        }
        users[msg.sender].jsonData[key] = newData;
        emit DataUpdated(msg.sender, key, newData);
    }

    // Function to retrieve JSON data
    function getData(string memory key) external view returns (string memory) {
        return users[msg.sender].jsonData[key];
    }

    

    function getAllUserData() external view returns (string[] memory keys, string[] memory values) {
        string[] memory filesArray = users[msg.sender].fileIds;
        keys = new string[](filesArray.length);
        values = new string[](filesArray.length);

        for(uint i = 0 ; i < filesArray.length ; i++){
            string memory key = filesArray[i];
            values[i] = users[msg.sender].jsonData[key];
            keys[i] = key;
        }

        return (keys, values);
    }


    // Function to delete JSON data
    function deleteData(string memory key) external {
        delete users[msg.sender].jsonData[key];
        emit DataUpdated(msg.sender, key, "");
    }

    function requestSign(string calldata fileId, address sendTo) external {
        users[msg.sender].fileToSignRequestAddresses[fileId].push(sendTo);
    }

    function addSignRequestersAddresses(string calldata fileId, address requester) external {
        Pair memory newPair = Pair(fileId, requester);
        users[msg.sender].signRequesters.push(newPair);
    }

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    // getters
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    function getNumFiles() external view returns(uint){
        return users[msg.sender].fileIds.length;
    }

    function getUserId() external view returns(uint256){
        return users[msg.sender].id;
    }

    function getUserAddress() external view returns(address){
        return msg.sender;
    }

    //whom i sent requests
    function getSignersRequested(string calldata fileId) external view returns (address[] memory){
        return users[msg.sender].fileToSignRequestAddresses[fileId];
    }

    //who has sent requests
    function getSignRequests() external view returns(string[] memory,address[] memory){
        uint n = users[msg.sender].signRequesters.length;
        string[] memory fileIds = new string[](n);
        address[] memory requesters = new address[](n);
        for(uint i = 0 ; i < n ; i++){
            fileIds[i] = users[msg.sender].signRequesters[i].fileId;
            requesters[i] = users[msg.sender].signRequesters[i].requester;
        }
        return (fileIds,requesters);
    }
}

// "f1","rounak"