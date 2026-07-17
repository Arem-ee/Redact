pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {RedactVault} from "../src/RedactVault.sol";

contract DeployRedactVault is Script {
    function run() external {
        vm.startBroadcast();
        new RedactVault();
        vm.stopBroadcast();
    }
}
