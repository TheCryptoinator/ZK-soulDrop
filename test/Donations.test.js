const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donations", function () {
  let Donations, donations, verifier, owner, addr1;
  const groupId = 1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const MockVerifier = await ethers.getContractFactory("MockSemaphoreVerifier");
    verifier = await MockVerifier.deploy();
    await verifier.deployed();

    Donations = await ethers.getContractFactory("Donations");
    donations = await Donations.deploy(verifier.address, groupId);
    await donations.deployed();
  });

  it("should accept a donation with a valid proof", async function () {
    const nullifierHash = 12345;
    const merkleRoot = 67890;
    const proof = Array(8).fill(0);
    const message = "Test donation";
    const value = ethers.parseEther("1.0");

    await expect(
      donations.connect(addr1).donateWithProof(message, merkleRoot, nullifierHash, proof, { value })
    )
      .to.emit(donations, "DonationReceived")
      .withArgs(nullifierHash, value, message);

    expect(await donations.totalDonations()).to.equal(value);
    expect(await donations.nullifierDonations(nullifierHash)).to.equal(value);
  });

  it("should not allow double donation with same nullifierHash", async function () {
    const nullifierHash = 12345;
    const merkleRoot = 67890;
    const proof = Array(8).fill(0);
    const message = "Test donation";
    const value = ethers.parseEther("1.0");

    await donations.connect(addr1).donateWithProof(message, merkleRoot, nullifierHash, proof, { value });
    await expect(
      donations.connect(addr1).donateWithProof(message, merkleRoot, nullifierHash, proof, { value })
    ).to.be.revertedWith("Nullifier already used");
  });

  it("should allow owner to withdraw funds", async function () {
    const nullifierHash = 12345;
    const merkleRoot = 67890;
    const proof = Array(8).fill(0);
    const message = "Test donation";
    const value = ethers.parseEther("1.0");

    await donations.connect(addr1).donateWithProof(message, merkleRoot, nullifierHash, proof, { value });
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    const tx = await donations.connect(owner).withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;
    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    expect(ownerBalanceAfter).to.be.above(ownerBalanceBefore);
  });
});
