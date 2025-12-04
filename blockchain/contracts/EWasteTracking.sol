// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EWasteTracking {

    // Enums
    enum Role { None, Manufacturer, Consumer, Recycler, Regulator }
    enum DeviceStatus { Manufactured, InUse, Collected, Destroyed, Recycled }

    // Structs
    struct User {
        address walletAddress;
        Role role;
        bool isRegistered;
    }

    struct Device {
        uint256 id;
        string name;
        string manufacturer;
        address manufacturerAddress;
        address currentOwner;
        DeviceStatus status;
        uint256 manufacturedDate;
        uint256 lastUpdated;
        bool exists;
    }

    struct RecyclingReport {
        uint256 id;
        uint256 deviceId;
        address recyclerAddress;
        uint256 weight;
        string components;
        uint256 timestamp;
        bool verified;
        address verifiedBy;
        bool exists;
    }

    // State variables
    mapping(address => User) public users;
    mapping(uint256 => Device) public devices;
    mapping(uint256 => RecyclingReport) public recyclingReports;
    mapping(uint256 => address[]) public deviceOwnerHistory;
    mapping(address => uint256[]) private ownerDevices;

    uint256 public deviceCount;
    uint256 public reportCount;

    // Events
    event UserRegistered(address indexed user, Role role);
    event DeviceRegistered(uint256 indexed deviceId, string name, address indexed manufacturer);
    event OwnershipTransferred(uint256 indexed deviceId, address indexed from, address indexed to);
    event StatusUpdated(uint256 indexed deviceId, DeviceStatus status);
    event RecyclingReportSubmitted(uint256 indexed reportId, uint256 indexed deviceId, address indexed recycler);
    event ReportVerified(uint256 indexed reportId, address indexed verifiedBy);

    // Modifiers
    modifier onlyRole(Role _role) {
        require(users[msg.sender].isRegistered, "User not registered");
        require(users[msg.sender].role == _role, "Unauthorized role");
        _;
    }

    modifier onlyDeviceOwner(uint256 _deviceId) {
        require(devices[_deviceId].exists, "Device does not exist");
        require(devices[_deviceId].currentOwner == msg.sender, "Not the device owner");
        _;
    }

    modifier deviceExists(uint256 _deviceId) {
        require(devices[_deviceId].exists, "Device does not exist");
        _;
    }

    modifier reportExists(uint256 _reportId) {
        require(recyclingReports[_reportId].exists, "Report does not exist");
        _;
    }

    // User Management Functions
    function registerUser(Role _role) external {
        require(_role != Role.None, "Invalid role");
        require(!users[msg.sender].isRegistered, "User already registered");

        users[msg.sender] = User({
            walletAddress: msg.sender,
            role: _role,
            isRegistered: true
        });

        emit UserRegistered(msg.sender, _role);
    }

    function getUserRole(address _user) external view returns (Role) {
        return users[_user].role;
    }

    function isUserRegistered(address _user) external view returns (bool) {
        return users[_user].isRegistered;
    }

    // Device Management Functions
    function registerDevice(string memory _name, string memory _manufacturer)
        external
        onlyRole(Role.Manufacturer)
        returns (uint256)
    {
        deviceCount++;
        uint256 newDeviceId = deviceCount;

        devices[newDeviceId] = Device({
            id: newDeviceId,
            name: _name,
            manufacturer: _manufacturer,
            manufacturerAddress: msg.sender,
            currentOwner: msg.sender,
            status: DeviceStatus.Manufactured,
            manufacturedDate: block.timestamp,
            lastUpdated: block.timestamp,
            exists: true
        });

        deviceOwnerHistory[newDeviceId].push(msg.sender);
        ownerDevices[msg.sender].push(newDeviceId);

        emit DeviceRegistered(newDeviceId, _name, msg.sender);

        return newDeviceId;
    }

    function transferOwnership(uint256 _deviceId, address _newOwner)
        external
        onlyDeviceOwner(_deviceId)
    {
        require(_newOwner != address(0), "Invalid new owner address");
        require(_newOwner != msg.sender, "Cannot transfer to yourself");
        require(users[_newOwner].isRegistered, "New owner not registered");

        address previousOwner = devices[_deviceId].currentOwner;
        devices[_deviceId].currentOwner = _newOwner;
        devices[_deviceId].status = DeviceStatus.InUse;
        devices[_deviceId].lastUpdated = block.timestamp;

        deviceOwnerHistory[_deviceId].push(_newOwner);
        ownerDevices[_newOwner].push(_deviceId);

        emit OwnershipTransferred(_deviceId, previousOwner, _newOwner);
    }

    // Function for consumers to claim newly manufactured devices
    function claimDevice(uint256 _deviceId)
        external
        deviceExists(_deviceId)
    {
        require(users[msg.sender].isRegistered, "User not registered");
        require(users[msg.sender].role == Role.Consumer, "Only consumers can claim devices");
        require(devices[_deviceId].status == DeviceStatus.Manufactured, "Device already claimed");
        require(devices[_deviceId].currentOwner != msg.sender, "Already owner");

        address previousOwner = devices[_deviceId].currentOwner;
        devices[_deviceId].currentOwner = msg.sender;
        devices[_deviceId].status = DeviceStatus.InUse;
        devices[_deviceId].lastUpdated = block.timestamp;

        deviceOwnerHistory[_deviceId].push(msg.sender);
        ownerDevices[msg.sender].push(_deviceId);

        emit OwnershipTransferred(_deviceId, previousOwner, msg.sender);
    }

    function updateDeviceStatus(uint256 _deviceId, DeviceStatus _status)
        external
        onlyRole(Role.Recycler)
        deviceExists(_deviceId)
    {
        require(_status == DeviceStatus.Collected ||
                _status == DeviceStatus.Destroyed ||
                _status == DeviceStatus.Recycled,
                "Invalid status for recycler");

        devices[_deviceId].status = _status;
        devices[_deviceId].lastUpdated = block.timestamp;

        emit StatusUpdated(_deviceId, _status);
    }

    function getDevice(uint256 _deviceId)
        external
        view
        deviceExists(_deviceId)
        returns (
            uint256 id,
            string memory name,
            string memory manufacturer,
            address manufacturerAddress,
            address currentOwner,
            DeviceStatus status,
            uint256 manufacturedDate,
            uint256 lastUpdated
        )
    {
        Device memory device = devices[_deviceId];
        return (
            device.id,
            device.name,
            device.manufacturer,
            device.manufacturerAddress,
            device.currentOwner,
            device.status,
            device.manufacturedDate,
            device.lastUpdated
        );
    }

    function getDeviceHistory(uint256 _deviceId)
        external
        view
        deviceExists(_deviceId)
        returns (address[] memory)
    {
        return deviceOwnerHistory[_deviceId];
    }

    function getDevicesByOwner(address _owner) external view returns (uint256[] memory) {
        return ownerDevices[_owner];
    }

    // Recycling Report Functions
    function submitRecyclingReport(
        uint256 _deviceId,
        uint256 _weight,
        string memory _components
    )
        external
        onlyRole(Role.Recycler)
        deviceExists(_deviceId)
        returns (uint256)
    {
        require(
            devices[_deviceId].status == DeviceStatus.Collected ||
            devices[_deviceId].status == DeviceStatus.Destroyed ||
            devices[_deviceId].status == DeviceStatus.Recycled,
            "Device not ready for recycling report"
        );

        reportCount++;
        uint256 newReportId = reportCount;

        recyclingReports[newReportId] = RecyclingReport({
            id: newReportId,
            deviceId: _deviceId,
            recyclerAddress: msg.sender,
            weight: _weight,
            components: _components,
            timestamp: block.timestamp,
            verified: false,
            verifiedBy: address(0),
            exists: true
        });

        emit RecyclingReportSubmitted(newReportId, _deviceId, msg.sender);

        return newReportId;
    }

    function verifyReport(uint256 _reportId)
        external
        onlyRole(Role.Regulator)
        reportExists(_reportId)
    {
        require(!recyclingReports[_reportId].verified, "Report already verified");

        recyclingReports[_reportId].verified = true;
        recyclingReports[_reportId].verifiedBy = msg.sender;

        emit ReportVerified(_reportId, msg.sender);
    }

    function getRecyclingReport(uint256 _reportId)
        external
        view
        reportExists(_reportId)
        returns (
            uint256 id,
            uint256 deviceId,
            address recyclerAddress,
            uint256 weight,
            string memory components,
            uint256 timestamp,
            bool verified,
            address verifiedBy
        )
    {
        RecyclingReport memory report = recyclingReports[_reportId];
        return (
            report.id,
            report.deviceId,
            report.recyclerAddress,
            report.weight,
            report.components,
            report.timestamp,
            report.verified,
            report.verifiedBy
        );
    }

    // Helper function to get all devices (for regulators)
    function getAllDevices() external view returns (uint256) {
        return deviceCount;
    }

    // Helper function to get all reports
    function getAllReports() external view returns (uint256) {
        return reportCount;
    }
}
