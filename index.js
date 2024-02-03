require("dotenv").config();
const ethers = require("ethers");
const express = require("express");
const app = express();
app.use(express.json());

const API_URL = process.env.HARDHAT_API_URL;
const PRIVATE_KEY = process.env.HARDHAT_PRIVATE_KEY;
const contractAddress = process.env.USERDATA_HARDHAT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const { abi } = require("./artifacts/contracts/UserData.sol/UserData.json"); // Adjust path as needed
const contractInstance = new ethers.Contract(contractAddress, abi, signer);

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//get requests
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// Endpoint to retrieve all UPLOADED files
app.get("/getAllFiles", async (req, res) => {
  try {
    const data = await contractInstance.getAllUserData();

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/getUserId", async (req, res) => {
  try {
    let userId = await contractInstance.getUserId();
    userId = parseInt(userId);

    res.status(200).json({ success: true, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/getUserAddress", async (req, res) => {
  try {
    const userAddress = await contractInstance.getUserAddress();

    res.status(200).json({ success: true, userAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/getNumFiles", async (req, res) => {
  try {
    let data = await contractInstance.getNumFiles();
    data = parseInt(data);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to retrieve JSON data
app.get("/getData/:key", async (req, res) => {
  try {
    const key = req.params.key;

    const data = await contractInstance.getData(key);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//whom I have requested
app.get("/getSignersRequested/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const data = await contractInstance.getSignersRequested(fileId);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//who has requested me
app.get("/getSignRequests", async (req, res) => {
  try {
    const data = await contractInstance.getSignRequests();

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//post requests
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// Endpoint to update or store JSON data
app.post("/updateData", async (req, res) => {
  try {
    const { key, newData } = req.body;

    const gasPrice = await provider.getGasPrice();

    // Estimate the gas limit for the transaction (optional)
    const gasLimit = await contractInstance.estimateGas.updateData(
      key,
      newData
    );

    const transaction = await contractInstance.updateData(key, newData, {
      gasLimit: gasLimit.mul(2), // Adjust the multiplier as needed
      gasPrice: gasPrice, // Optional, use current gas price or specify a fixed value
    });

    await transaction.wait();

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// i am requesting someone to sign
app.post("/requestSign/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const { sendTo } = req.body;

    const gasPrice = await provider.getGasPrice();
    const gasLimit = await contractInstance.estimateGas.requestSign(
      fileId,
      sendTo
    );

    const transaction = await contractInstance.requestSign(fileId, sendTo, {
      gasLimit: gasLimit.mul(2),
      gasPrice: gasPrice,
    });

    await transaction.wait();

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// i am accepting sign requests from someone
app.post("/addSignRequestersAddresses/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const { requesterAddress } = req.body;

    const gasPrice = await provider.getGasPrice();
    const gasLimit =
      await contractInstance.estimateGas.addSignRequestersAddresses(
        fileId,
        requesterAddress
      );

    const transaction = await contractInstance.addSignRequestersAddresses(
      fileId,
      requesterAddress,
      {
        gasLimit: gasLimit.mul(2),
        gasPrice: gasPrice,
      }
    );

    await transaction.wait();

    res
      .status(200)
      .json({ success: true, message: "Data updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//delete requests
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// Endpoint to delete JSON data
app.delete("/deleteData/:key", async (req, res) => {
  try {
    const key = req.params.key;

    const transaction = await contractInstance.deleteData(key);

    await transaction.wait();

    res
      .status(200)
      .json({ success: true, message: "Data deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//VALIDATION ENDPOINTS
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// Your other routes and middleware can go here...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
