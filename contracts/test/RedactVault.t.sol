pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {RedactVault} from "../src/RedactVault.sol";

contract RedactVaultTest is Test {
    RedactVault vault;

    event VaultLabelRegistered(address indexed registrar, string label);

    function setUp() public {
        vault = new RedactVault();
    }

    function test_Register() public {
        vm.expectEmit(true, true, false, true);
        emit VaultLabelRegistered(address(this), "My Secret Vault");

        vault.register("My Secret Vault");

        assertEq(vault.getLabel(address(this)), "My Secret Vault");
    }

    function test_RegisterDifferentAddresses() public {
        vault.register("alice");
        assertEq(vault.getLabel(address(this)), "alice");

        address bob = makeAddr("bob");
        vm.prank(bob);
        vault.register("bob");
        assertEq(vault.getLabel(bob), "bob");

        assertEq(vault.getLabel(address(this)), "alice");
    }

    function test_UpdateLabel() public {
        vault.register("first");
        vault.register("second");
        assertEq(vault.getLabel(address(this)), "second");
    }
}
