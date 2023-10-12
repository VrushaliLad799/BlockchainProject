const TimberSupplyChain = artifacts.require('./TimberSupplyChain.sol');

contract('TimberSupplyChain', (accounts) => {
  let timberSupplyChain;
  const stageMapping = {
    Harvest: 0,
    Transport: 1,
    Processing: 2,
    Distribution: 3,
  };

  before(async () => {
    timberSupplyChain = await TimberSupplyChain.deployed();
  });

  it('deploys successfully', async () => {
    const address = await timberSupplyChain.address;
    assert.notEqual(address, '0x0');
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it('adds batches', async () => {
    const batchId = 'Batch123';
    const initialStage = 'Harvest';
    const initialLocation = 'Location123';
    const stageEnumValue = stageMapping[initialStage];

    const result = await timberSupplyChain.addBatch(batchId, stageEnumValue, initialLocation);
    console.log(result);
    const event = result.logs[0].args;

    assert.equal(event.batchId, batchId);
    assert.equal(event.stage, stageEnumValue);
    assert.equal(event.location, initialLocation);
   
  });
});
