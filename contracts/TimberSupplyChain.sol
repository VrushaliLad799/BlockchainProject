// TimberSupplyChains.sol

pragma solidity ^0.5.16;


contract TimberSupplyChain {

    uint public batchCount = 0;

    enum SupplyChainStage { Harvest, Transport, Processing, Distribution }

    struct TimberBatch {
        uint id;
        string batchId;
        SupplyChainStage stage;
        uint timestamp;
        string location;
    }

    mapping(uint => TimberBatch) public batches;

    event BatchCreated(
        uint id,
        string batchId,
        SupplyChainStage stage,
        uint timestamp,
        string location
    );

    event BatchUpdated(
        uint id,
        SupplyChainStage newStage,
        uint timestamp,
        string location
    );

    constructor() public {
        addBatch("InitialBatch", SupplyChainStage.Harvest, "InitialLocation");
    }

    function addBatch(string memory _batchId, SupplyChainStage _initialStage, string memory _initialLocation) public {
        batchCount++;
        batches[batchCount] = TimberBatch(batchCount, _batchId, _initialStage, block.timestamp, _initialLocation);
        emit BatchCreated(batchCount, _batchId, _initialStage, block.timestamp, _initialLocation);
    }

    function updateBatchStage(uint _id, SupplyChainStage _newStage, string memory _location) public {
        require(_id <= batchCount, "Batch does not exist");
        TimberBatch storage batch = batches[_id];
        batch.stage = _newStage;
        batch.timestamp = block.timestamp;
        batch.location = _location;
        emit BatchUpdated(_id, _newStage, block.timestamp, _location);
    }

    // Function to get the total batch count
    function getBatchCount() public view returns (uint) {
        return batchCount;
    }

    
}