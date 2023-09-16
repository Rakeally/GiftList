const axios = require("axios");
const niceList = require("../utils/niceList.json");
const MerkleTree = require("../utils/MerkleTree");

const serverUrl = "http://localhost:1225";

async function fetchGift(name) {
  try {
    const merkleTree = new MerkleTree(niceList);
    const index = niceList.findIndex((n) => n === name);

    if (index === -1) {
      throw new Error("Name not found in the nice list.");
    }

    const proof = merkleTree.getProof(index);
    const { data: gift } = await axios.post(`${serverUrl}/gift`, {
      name,
      proof,
    });
    return gift;
  } catch (error) {
    throw new Error(`Failed to fetch gift: ${error.message}`);
  }
}

async function main() {
  try {
    const [name] = process.argv.slice(2);

    if (!name) {
      throw new Error(
        `Please enter a name as a command-line argument. Ex ** node client/index "Everett Bergnaum DVM" **`
      );
    }

    const gift = await fetchGift(name);
    console.log({ gift });
  } catch (error) {
    console.error(error.message);
  }
}

main();
