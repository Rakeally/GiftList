const express = require("express");
const verifyProof = require("../utils/verifyProof");
const niceList = require("../utils/niceList.json");
const MerkleTree = require("../utils/MerkleTree");
const bodyParser = require("body-parser");

const port = 1225;

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// TODO: hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const merkleTree = new MerkleTree(niceList);
const root = merkleTree.getRoot();

// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = root;
app.post("/gift", (req, res) => {
  try {
    const { name, proof } = req.body;

    const isInTheList = verifyProof(proof, name, MERKLE_ROOT);

    if (isInTheList) {
      res.status(200).json({ message: "You got a toy robot!" });
    } else {
      res.status(200).json({ message: "You are not on the list :(" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
