// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract DisasterManagement {
    uint256 internal disasterReportLength = 0;

    struct DisasterReport {
        address  payable  reporterId;
        string reporterName;
        string email;
        string disasterType;
        string imgUrl;
        string latitude;
        string longitude;
        string city;
        string state;
        string date;
        string severity;
        string impact;
    }

    struct DisasterImage {
        address reporterId;
        string timestamp;
        string disasterImageUrl;
    }

    struct Resource {
        uint256 amount;  // Amount of resources allocated
        string resourceType;  // e.g., "funds", "food", "medicine"
        address allocatedBy;  // Address that allocated the resource
    }

        struct FundAllocation {
        uint256 amount; // The amount of Ether allocated
        string description; // The description of the funds
        address allocatedBy; // The address of the allocator
    }

    // mappings to store disaster reports, images, and resources
    mapping(uint256 => DisasterReport) internal disasterReports;
    mapping(uint256 => DisasterImage[]) internal disasterImages;
    mapping(uint256 => Resource[]) internal disasterResources;
    mapping(uint256 => FundAllocation[]) internal disasterFunds;

    // Function to create a disaster report
    function createDisasterReport(
        string memory _reporterName,
        string memory _email,
        string memory _disasterType,
        string memory _imgUrl,
        string memory _latitude,
        string memory _longitude,
        string memory _city,
        string memory _state,
        string memory _date,
        string memory _severity,
        string memory _impact
    ) public {
        disasterReports[disasterReportLength] = DisasterReport({
            reporterId: payable (msg.sender),
            reporterName: _reporterName,
            email: _email,
            disasterType: _disasterType,
            imgUrl: _imgUrl,
            latitude: _latitude,
            longitude: _longitude,
            city: _city,
            state: _state,
            date: _date,
            severity: _severity,
            impact: _impact
        });

        disasterReportLength++;
    }

    // Function to get disaster report details by index
    function getDisasterReport(
        uint256 _index
    )
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        require(_index < disasterReportLength, "Invalid report index");
        DisasterReport memory disasterReport = disasterReports[_index];
        return (
            disasterReport.reporterId,
            disasterReport.reporterName,
            disasterReport.email,
            disasterReport.disasterType,
            disasterReport.imgUrl,
            disasterReport.latitude,
            disasterReport.longitude,
            disasterReport.city,
            disasterReport.state,
            disasterReport.date,
            disasterReport.severity,
            disasterReport.impact
        );
    }

    // Function to allocate funds for a disaster report
    function allocateFunds(
        uint256 disasterId,
        string memory description
    ) public payable {
        require(disasterId < disasterReportLength, "Invalid disaster report ID");
        require(msg.value > 0, "No funds sent");

        // Allocate funds to the disaster report
        disasterFunds[disasterId].push(
            FundAllocation({
                amount: msg.value,   // The amount of funds sent with the transaction
                description: description,
                allocatedBy: msg.sender
            })
        );
    }

    // Function to get funds allocated for a specific disaster report
    function getAllocatedFunds(uint256 disasterId) public view returns (FundAllocation[] memory) {
        require(disasterId < disasterReportLength, "Invalid disaster report ID");
        return disasterFunds[disasterId];
    }

    // Function for the reporter or an authorized entity to withdraw funds
    function withdrawFunds(uint256 disasterId, uint256 fundIndex) public {
        require(disasterId < disasterReportLength, "Invalid disaster report ID");
        require(fundIndex < disasterFunds[disasterId].length, "Invalid fund index");
        
        FundAllocation memory fund = disasterFunds[disasterId][fundIndex];
        require(
            msg.sender == disasterReports[disasterId].reporterId || msg.sender == fund.allocatedBy,
            "Only the reporter or allocator can withdraw funds"
        );

        // Transfer the allocated funds to the caller
        payable(msg.sender).transfer(fund.amount);

        // Remove the fund after withdrawal
        disasterFunds[disasterId][fundIndex] = disasterFunds[disasterId][
            disasterFunds[disasterId].length - 1
        ];
        disasterFunds[disasterId].pop();
    }


    // Function to add disaster image
    function addDisasterImage(
        uint256 id,
        string memory _imageUrl,
        string memory _timestamp
    ) public {
        require(id < disasterReportLength, "Invalid report index");
        require(msg.sender == disasterReports[id].reporterId, "You are not the owner of this report");
        
        disasterImages[id].push(
            DisasterImage({
                reporterId: msg.sender,
                disasterImageUrl: _imageUrl,
                timestamp: _timestamp
            })
        );
    }

    // Function to get disaster images
    function getDisasterImages(uint256 id) public view returns (DisasterImage[] memory) {
        require(id < disasterReportLength, "Invalid report index");
        return disasterImages[id];
    }

    // Function to delete disaster report and associated images/resources
    function deleteDisasterReport(uint256 id) public {
        require(id < disasterReportLength, "Invalid report index");
        require(msg.sender == disasterReports[id].reporterId, "Please ensure you are the owner of this report");

        // Delete associated images and resources
        delete disasterImages[id];
        delete disasterResources[id];

        for (uint256 i = id; i < disasterReportLength - 1; i++) {
            disasterReports[i] = disasterReports[i + 1];
            disasterImages[i] = disasterImages[i + 1];
            disasterResources[i] = disasterResources[i + 1];
        }

        delete disasterReports[disasterReportLength - 1];
        delete disasterImages[disasterReportLength - 1];
        delete disasterResources[disasterReportLength - 1];
        disasterReportLength--;
    }

    // Function to get disaster report length
    function getDisasterReportLength() public view returns (uint256) {
        return disasterReportLength;
    }
}
