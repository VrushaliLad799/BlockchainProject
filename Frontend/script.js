// Define the mapping of stages to their enum values
const stageMapping = {
  'Harvest': 0,
  'Transport': 1,
  'Processing': 2,
  'Distribution': 3
};

// Main App object
App = {
  loading: false,
  contracts: {},
  web3Provider: null,
  account: null,

  // Load function to initialize the app
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  //used to connect to local blockchain using metamask
  // Load the Web3 provider
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = ethereum;
      web3 = new Web3(ethereum);
    } else {
      window.alert("Please connect to MetaMask.");
    }
  
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
        // Account access granted, continue with your DApp logic
      } catch (error) {
        if (error.code === 4001) {
          console.log("User denied account access. Please enable account access in MetaMask settings.");
        } else {
          console.log("An error occurred:", error);
        }
      }
    } else if (window.web3) {
      App.web3Provider = ethereum;
      window.web3 = new Web3(ethereum);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  },
  
  // Load the user's Ethereum account
  loadAccount: async () => {
    const accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
    console.log(App.account);
  },

  
  // Load the smart contract
  loadContract: async () => {
    const timberSupplyChainJson = await $.getJSON('TimberSupplyChain.json');
    console.log(timberSupplyChainJson);
    const TimberSupplyChainContract = TruffleContract(timberSupplyChainJson);
    TimberSupplyChainContract.setProvider(App.web3Provider);
    App.contracts.TimberSupplyChain = TimberSupplyChainContract;

    // Deploy the TimberSupplyChain contract instance to interact with the deployed contract on the blockchain
    // and store the instance in the App's timberSupplyChain property
    App.timberSupplyChain = await App.contracts.TimberSupplyChain.deployed();

  }, 
  
  // Render function to display user information
  render: async () => {
      $('#account').text(App.account);
  },

// Function to add a new batch
addNewBatch: async (batchId, initialStage, initialLocation) => {
  try {
    if (!Object.keys(stageMapping).includes(initialStage)) {
      throw new Error(`Invalid stage: ${initialStage}`);
    }

    const stageEnumValue = stageMapping[initialStage];

    await App.timberSupplyChain.addBatch(
      batchId,
      stageEnumValue,
      initialLocation,
      { from: App.account }
    );

    console.log('New batch added successfully!');
    alert('New batch added successfully!');
    // Update UI or perform other actions here
  } catch (error) {
    console.error('Error adding new batch:', error);
    alert('An error occurred while adding the new batch.');
  }
},

// Function to retrieve batch information
retrieveBatch: async (batchId) => {
  try {
    const batchInfo = await App.timberSupplyChain.batches(batchId);
    console.log('Retrieved batch information:', batchInfo);

    // Map the numerical stage to its string representation
    const stageMapping = {
      0: 'Harvest',
      1: 'Transport',
      2: 'Processing',
      3: 'Distribution',
    };

    // Get the string representation of the stage
    const stageString = stageMapping[batchInfo.stage];

    // Update the UI to display the retrieved batch information
    const retrievedBatchContainer = document.getElementById('retrievedBatchContainer');
    retrievedBatchContainer.innerHTML = `
      <h3>Retrieved Batch Information</h3>
      <p>Batch ID: ${batchInfo.batchId}</p>
      <p>Stage: ${stageString}</p>
      <p>Timestamp: ${new Date(batchInfo.timestamp * 1000).toLocaleString()}</p>
      <p>Location: ${batchInfo.location}</p>
    `;
  } catch (error) {
    console.error('Error retrieving batch information:', error);
    alert('An error occurred while retrieving batch information.');
  }
}


};

// Initialize the app on document ready
$(() => {
  $(document).ready(() => {
    App.load();

    // Event listener for the "Add Batch" button
    $('#addBatchButton').click(() => {
      const batchId = $('#newBatchId').val();
      const initialStage = $('#initialStage').val().toString();  // Make sure the value is a string
      const initialLocation = $('#initialLocation').val();
      App.addNewBatch(batchId, initialStage, initialLocation);
    });

    // Event listener for the "Retrieve" button
    $('#retrieveButton').click(() => {
      const batchId = $('#batchId').val();
      App.retrieveBatch(batchId);
    });
  });
});