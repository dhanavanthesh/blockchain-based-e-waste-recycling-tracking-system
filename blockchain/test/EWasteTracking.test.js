const EWasteTracking = artifacts.require("EWasteTracking");

contract("EWasteTracking", (accounts) => {
  let contract;
  const [owner, manufacturer, consumer, recycler, regulator, unregistered] = accounts;

  const Role = {
    None: 0,
    Manufacturer: 1,
    Consumer: 2,
    Recycler: 3,
    Regulator: 4
  };

  const DeviceStatus = {
    Manufactured: 0,
    InUse: 1,
    Collected: 2,
    Destroyed: 3,
    Recycled: 4
  };

  beforeEach(async () => {
    contract = await EWasteTracking.new();
  });

  describe("User Registration", () => {
    it("should register a manufacturer", async () => {
      const tx = await contract.registerUser(Role.Manufacturer, { from: manufacturer });

      assert.equal(tx.logs[0].event, "UserRegistered");
      assert.equal(tx.logs[0].args.user, manufacturer);
      assert.equal(tx.logs[0].args.role.toNumber(), Role.Manufacturer);

      const isRegistered = await contract.isUserRegistered(manufacturer);
      assert.equal(isRegistered, true);
    });

    it("should register different user roles", async () => {
      await contract.registerUser(Role.Manufacturer, { from: manufacturer });
      await contract.registerUser(Role.Consumer, { from: consumer });
      await contract.registerUser(Role.Recycler, { from: recycler });
      await contract.registerUser(Role.Regulator, { from: regulator });

      const mRole = await contract.getUserRole(manufacturer);
      const cRole = await contract.getUserRole(consumer);
      const rRole = await contract.getUserRole(recycler);
      const regRole = await contract.getUserRole(regulator);

      assert.equal(mRole.toNumber(), Role.Manufacturer);
      assert.equal(cRole.toNumber(), Role.Consumer);
      assert.equal(rRole.toNumber(), Role.Recycler);
      assert.equal(regRole.toNumber(), Role.Regulator);
    });

    it("should not allow duplicate registration", async () => {
      await contract.registerUser(Role.Manufacturer, { from: manufacturer });

      try {
        await contract.registerUser(Role.Consumer, { from: manufacturer });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "User already registered");
      }
    });

    it("should not allow registration with None role", async () => {
      try {
        await contract.registerUser(Role.None, { from: unregistered });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Invalid role");
      }
    });
  });

  describe("Device Registration", () => {
    beforeEach(async () => {
      await contract.registerUser(Role.Manufacturer, { from: manufacturer });
    });

    it("should register a device by manufacturer", async () => {
      const tx = await contract.registerDevice("iPhone 13", "Apple Inc.", { from: manufacturer });

      assert.equal(tx.logs[0].event, "DeviceRegistered");
      assert.equal(tx.logs[0].args.deviceId.toNumber(), 1);
      assert.equal(tx.logs[0].args.name, "iPhone 13");
      assert.equal(tx.logs[0].args.manufacturer, manufacturer);

      const deviceCount = await contract.deviceCount();
      assert.equal(deviceCount.toNumber(), 1);
    });

    it("should not allow non-manufacturer to register device", async () => {
      await contract.registerUser(Role.Consumer, { from: consumer });

      try {
        await contract.registerDevice("iPhone 13", "Apple Inc.", { from: consumer });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Unauthorized role");
      }
    });

    it("should retrieve device details", async () => {
      await contract.registerDevice("iPhone 13", "Apple Inc.", { from: manufacturer });

      const device = await contract.getDevice(1);

      assert.equal(device.id.toNumber(), 1);
      assert.equal(device.name, "iPhone 13");
      assert.equal(device.manufacturer, "Apple Inc.");
      assert.equal(device.manufacturerAddress, manufacturer);
      assert.equal(device.currentOwner, manufacturer);
      assert.equal(device.status.toNumber(), DeviceStatus.Manufactured);
    });
  });

  describe("Ownership Transfer", () => {
    beforeEach(async () => {
      await contract.registerUser(Role.Manufacturer, { from: manufacturer });
      await contract.registerUser(Role.Consumer, { from: consumer });
      await contract.registerDevice("iPhone 13", "Apple Inc.", { from: manufacturer });
    });

    it("should transfer device ownership", async () => {
      const tx = await contract.transferOwnership(1, consumer, { from: manufacturer });

      assert.equal(tx.logs[0].event, "OwnershipTransferred");
      assert.equal(tx.logs[0].args.deviceId.toNumber(), 1);
      assert.equal(tx.logs[0].args.from, manufacturer);
      assert.equal(tx.logs[0].args.to, consumer);

      const device = await contract.getDevice(1);
      assert.equal(device.currentOwner, consumer);
      assert.equal(device.status.toNumber(), DeviceStatus.InUse);
    });

    it("should update ownership history", async () => {
      await contract.transferOwnership(1, consumer, { from: manufacturer });

      const history = await contract.getDeviceHistory(1);
      assert.equal(history.length, 2);
      assert.equal(history[0], manufacturer);
      assert.equal(history[1], consumer);
    });

    it("should not allow non-owner to transfer", async () => {
      try {
        await contract.transferOwnership(1, consumer, { from: consumer });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Not the device owner");
      }
    });

    it("should not allow transfer to unregistered user", async () => {
      try {
        await contract.transferOwnership(1, unregistered, { from: manufacturer });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "New owner not registered");
      }
    });
  });

  describe("Device Status Updates", () => {
    beforeEach(async () => {
      await contract.registerUser(Role.Manufacturer, { from: manufacturer });
      await contract.registerUser(Role.Recycler, { from: recycler });
      await contract.registerDevice("iPhone 13", "Apple Inc.", { from: manufacturer });
    });

    it("should allow recycler to update device status", async () => {
      const tx = await contract.updateDeviceStatus(1, DeviceStatus.Collected, { from: recycler });

      assert.equal(tx.logs[0].event, "StatusUpdated");
      assert.equal(tx.logs[0].args.deviceId.toNumber(), 1);
      assert.equal(tx.logs[0].args.status.toNumber(), DeviceStatus.Collected);

      const device = await contract.getDevice(1);
      assert.equal(device.status.toNumber(), DeviceStatus.Collected);
    });

    it("should not allow non-recycler to update status", async () => {
      await contract.registerUser(Role.Consumer, { from: consumer });

      try {
        await contract.updateDeviceStatus(1, DeviceStatus.Collected, { from: consumer });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Unauthorized role");
      }
    });
  });

  describe("Recycling Reports", () => {
    beforeEach(async () => {
      await contract.registerUser(Role.Manufacturer, { from: manufacturer });
      await contract.registerUser(Role.Recycler, { from: recycler });
      await contract.registerUser(Role.Regulator, { from: regulator });
      await contract.registerDevice("iPhone 13", "Apple Inc.", { from: manufacturer });
      await contract.updateDeviceStatus(1, DeviceStatus.Collected, { from: recycler });
    });

    it("should allow recycler to submit report", async () => {
      const tx = await contract.submitRecyclingReport(1, 150, "Glass, Aluminum, Lithium", { from: recycler });

      assert.equal(tx.logs[0].event, "RecyclingReportSubmitted");
      assert.equal(tx.logs[0].args.reportId.toNumber(), 1);
      assert.equal(tx.logs[0].args.deviceId.toNumber(), 1);
      assert.equal(tx.logs[0].args.recycler, recycler);

      const reportCount = await contract.reportCount();
      assert.equal(reportCount.toNumber(), 1);
    });

    it("should retrieve report details", async () => {
      await contract.submitRecyclingReport(1, 150, "Glass, Aluminum, Lithium", { from: recycler });

      const report = await contract.getRecyclingReport(1);

      assert.equal(report.id.toNumber(), 1);
      assert.equal(report.deviceId.toNumber(), 1);
      assert.equal(report.recyclerAddress, recycler);
      assert.equal(report.weight.toNumber(), 150);
      assert.equal(report.components, "Glass, Aluminum, Lithium");
      assert.equal(report.verified, false);
    });

    it("should allow regulator to verify report", async () => {
      await contract.submitRecyclingReport(1, 150, "Glass, Aluminum, Lithium", { from: recycler });

      const tx = await contract.verifyReport(1, { from: regulator });

      assert.equal(tx.logs[0].event, "ReportVerified");
      assert.equal(tx.logs[0].args.reportId.toNumber(), 1);
      assert.equal(tx.logs[0].args.verifiedBy, regulator);

      const report = await contract.getRecyclingReport(1);
      assert.equal(report.verified, true);
      assert.equal(report.verifiedBy, regulator);
    });

    it("should not allow non-regulator to verify report", async () => {
      await contract.submitRecyclingReport(1, 150, "Glass, Aluminum, Lithium", { from: recycler });

      try {
        await contract.verifyReport(1, { from: manufacturer });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Unauthorized role");
      }
    });

    it("should not allow duplicate verification", async () => {
      await contract.submitRecyclingReport(1, 150, "Glass, Aluminum, Lithium", { from: recycler });
      await contract.verifyReport(1, { from: regulator });

      try {
        await contract.verifyReport(1, { from: regulator });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Report already verified");
      }
    });
  });

  describe("Query Functions", () => {
    beforeEach(async () => {
      await contract.registerUser(Role.Manufacturer, { from: manufacturer });
      await contract.registerUser(Role.Consumer, { from: consumer });
    });

    it("should get devices by owner", async () => {
      await contract.registerDevice("iPhone 13", "Apple", { from: manufacturer });
      await contract.registerDevice("iPad Pro", "Apple", { from: manufacturer });

      const devices = await contract.getDevicesByOwner(manufacturer);
      assert.equal(devices.length, 2);
      assert.equal(devices[0].toNumber(), 1);
      assert.equal(devices[1].toNumber(), 2);
    });

    it("should get total device count", async () => {
      await contract.registerDevice("iPhone 13", "Apple", { from: manufacturer });
      await contract.registerDevice("iPad Pro", "Apple", { from: manufacturer });
      await contract.registerDevice("MacBook", "Apple", { from: manufacturer });

      const count = await contract.getAllDevices();
      assert.equal(count.toNumber(), 3);
    });
  });
});
