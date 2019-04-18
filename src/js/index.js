// JavaScript SDK Demo App
// Copyright 2018 Optimizely. Licensed under the Apache License


// sdk installed and datafile retrieved
import OptimizelyManager from './optimizely_manager';
const _ = require('underscore');
window.activeUser = {}, window.items = [], window.userList = [];
//let optimizelyClientInstance = {};

// primary function executed at load time
async function main() {

    ///////////////   Create Optimizely Client Instance //////////////////////
    const optimizelyClientInstance = await OptimizelyManager.createInstance();
    //////////////////////////////////////////////////////////////////////////

    $(document).ready(function () {
        if (document.location.search.indexOf("emulate") > -1) {
            _buildUsers().then(_renderUserList).then(function () {
                $("#user-container").show();
            });
        }

        _buildItems().then(_renderItemsTable).then(function () {
            $('#input-name-button').on('click', function () {
                _setActiveUser();
                let userID = $('#users-list').val() || -1;
                shop(userID);
            });
        });
    });

    async function _buildItems() {
        window.items = [];
        await $.ajax({
            url: './items.csv',
            dataType: 'text',
            success: function (data) {
                let itemLines = data.split('\n');
                for (var i = 0; i < itemLines.length; i++) {
                    let item = itemLines[i].split(',');
                    items.push({
                        name: item[0],
                        color: item[1],
                        category: item[2],
                        price: parseInt(item[3].slice(1)),
                        imageUrl: item[4],
                    });
                }
            },
        });
        return items;
    }

    // creates the table of products, using an A/B experiment to determine the number of items per row to display
    function _renderItemsTable(items) {

        let table = document.createElement('table');
        let i = 0;
        while (typeof items[i] !== 'undefined') {
            let row = table.insertRow(-1);
            let itemsPerRow = 3; // default

            // activate the A/B experiment to assign the number of items to display for this user
            if (Object.entries(activeUser).length > 0) {
                const num_items_variation = optimizelyClientInstance.activate('items_per_row', activeUser.id, activeUser);
                if (!!num_items_variation) {
                    try {
                        var pattern = /^items_(\d+)$/g;
                        itemsPerRow = parseInt(pattern.exec(num_items_variation)[1]);
                    } catch (err) {
                        console.error("Failed to find the number of items per row from the A/B experiment.  The value returned was:", num_items_variation);
                    }
                }

            }

            for (var c = 0; c < itemsPerRow; c++) {
                let cell = row.insertCell(-1);
                let cellContent = document.createElement('div');
                if (!!items[i]) {
                    cellContent.innerHTML = items[i].name;
                    cellContent.innerHTML += ' in ' + items[i].color + '<br>';
                    cellContent.innerHTML += '<b>' + items[i].category + ', $' + items[i].price + '</b>';
                    cellContent.innerHTML += '<img src="./images/' + items[i].imageUrl + '" >';
                    cellContent.innerHTML += '<button data-itemid="' + i + '"' + 'class="red-button buy-button">Buy Now</button>';
                }
                cell.appendChild(cellContent);
                i += 1;
            }
        }
        $('#items-table').empty().html(table);

        $(".buy-button").off("click").on("click", function () {
            let userID = $('#users-list').val() || -1;
            let itemID = $(this).data("itemid");
            _logPurchase(userID, itemID);
        });


        return table;
    }

    // creates the item sorting dropdown menu based on feature rollout and feature test
    function _renderSortingDropdown() {
        const selectTitle = document.createElement('span');
        selectTitle.innerHTML += 'Sort Items By: ';
        const selectTypes = document.createElement('select');
        selectTypes.setAttribute('id', 'sorting_type');
        selectTypes.innerHTML += '<option disabled selected value></option>';

        // determine and handle order of item sort options

        ////////// Get Feature Test Variable Value ///////////////////////////////////////////
        var first_option = optimizelyClientInstance.getFeatureVariableString('sorting_enabled', 'first_option', activeUser.id, activeUser);
        //////////////////////////////////////////////////////////////////////////////////////

        if (first_option == "Price") {
            selectTypes.innerHTML += '<option value="price">Price</option>';
            selectTypes.innerHTML += '<option value="category">Category</option>';
        } else {
            selectTypes.innerHTML += '<option value="category">Category</option>';
            selectTypes.innerHTML += '<option value="price">Price</option>';
        }

        selectTitle.appendChild(selectTypes)
        $('#sorting').html(selectTitle);
        $('#sorting').on('change', function () {
            var sortType = $('#sorting_type option:selected').val();
            var userId = $('#users-list').val() || -1;

            //////// Track Sorting Feature Engagement ////////////////////////////
            optimizelyClientInstance.track('sorting_change', userId, activeUser);
            //////////////////////////////////////////////////////////////////////

            _buildItems().then(function (items) {
                items = _.sortBy(items, sortType);
                return _renderItemsTable(items);
            }).then(function () {
                $(".buy-button").off("click").on("click", function () {
                    let userID = $('#users-list').val() || -1;
                    let itemID = $(this).data("itemid");
                    _logPurchase(userID, itemID);
                });

            });
        });
    }

    async function _buildUsers() {
        let users = [];
        await $.ajax({
            type: "GET",
            url: './users.csv',
            dataType: 'text',
            success: function (data) {
                let userLines = data.split('\n');
                for (var i = 0; i < userLines.length; i++) {
                    let user = userLines[i].split(',');
                    users.push({
                        id: user[0],
                        name: user[1],
                        gender: user[2],
                        orderCount: user[3],
                        lifetimeValue: parseInt(user[4].slice(1))
                    });
                }
            },
        });
        userList = users;
        return users;
    }

    function _renderUserList(users) {
        let list = document.createElement('select');
        list.id = "users-list";
        list.insertAdjacentHTML("afterbegin", "<option selected disabled value></option>");
        list.addEventListener("change", _updateUserDetailsTable);
        let i = 0;
        while (typeof users[i] !== 'undefined') {
            let user = users[i];
            let option = document.createElement("option");
            option.value = user.id;
            option.text = user.name;
            list.add(option);
            i += 1;
        }
        document.getElementById("users-list-container").insertAdjacentElement("afterbegin", list);
        var storedId = localStorage.getItem("opzDemoUser");
        if (!!storedId) {
            console.log("StoredId:", storedId);
            $("#users-list > option[value='" + storedId + "']")[0].selected = true;
            _updateUserDetailsTable();
            $("#input-name-button").click();
        }

        return list;
    }

    async function _updateUserDetailsTable() {
        let container = $("#user-details");
        $(container).empty();
        let userid = $("#users-list").val();
        let userIndex = parseInt(userid);
        if (!!userid) {
            console.log("Updating user details table for active user", userid);
            let user = window.userList[userIndex];
            let userDetails = $("<div class='userRow'>");
            for (var prop in user) {
                $("<div class='userProperty'>").html("<b>" + prop + ":</b>" + (prop === "lifetimeValue" ? "$" : "") + user[prop]).appendTo(userDetails);
            }
            $(container).append(userDetails);
        }
    }

    // get user data from the CSV import to use elsewhere
    function _setActiveUser() {
        let userID = $('#users-list').val();
        if (!userID) {
            console.error("Failed to get active user.  UserID is", userID);
            return false;
        }
        if (userList && userList.length > 0) {
            var user = userList[parseInt(userID)];
            for (var prop in user) {
                window.activeUser[prop] = user[prop];
            }
        } else console.error("Failed to find the userList in setActiveUser()");
        return window.activeUser;

    }

    // when emulating a user, this will set the active user and rebuild the UI based on roll outs & features affecting that user
    function shop(userID) {
        console.log("Shopping for user", userID);
        localStorage.setItem("opzDemoUser", userID);

        // retrieve item sorting Feature Flag value for this user
        const isSortingEnabled = optimizelyClientInstance.isFeatureEnabled('sorting_enabled', userID, activeUser);

        // display feature if enabled
        if (isSortingEnabled) {
            _renderSortingDropdown();
        } else {
            // ensure feature is hidden if disabled
            $('#sorting').hide();
        }

        // update UI to display if Feature Flag is enabled
        const indicatorBool = (isSortingEnabled) ? 'ON' : 'OFF';
        const indicatorMessage = `[Feature ${indicatorBool}] The feature "sorting_enabled" is ${indicatorBool} for user ${userID}`;
        $('#feature-indicator').html(indicatorMessage);

        // retrieve welcome message Feature Flag value for this user
        const showWelcomeMessage = optimizelyClientInstance.isFeatureEnabled('welcome_message_enabled', userID, activeUser);
        if (showWelcomeMessage) {

            // retrieve welcome message Feature Test variation for this user
            const welcomeMessageVar = optimizelyClientInstance.getFeatureVariableString('welcome_message_enabled', 'welcome_text', userID, activeUser);
            if (!!welcomeMessageVar) {
                $('#welcome').show().html(welcomeMessageVar);
            } else {
                // Set a default message
                $('#welcome').html('Welcome to Attic & Button');
            }

        } else $("#welcome").hide();

        _renderItemsTable(window.items);
    }

    // log a purchase event, using user ID and item attributes
    async function _logPurchase(user, item) {
        // create object of item attributes to be sent as event payload
        var itemAttributes = {
            category: items[item].category,
            price: items[item].price,
            revenue: items[item].price * 100,
        };
        var userId = user.toString();
        var userIndex = parseInt(userId);
        var price = itemAttributes.price;

        if (!!userId && !!price && price > 0) {
            if (userIndex > -1) {
                // on conversion, increment user values (though this isn't being successfully written to the CSV at the moment)
                ++userList[userIndex].orderCount;
                userList[userIndex].lifetimeValue += price;
                _updateUserDetailsTable();

                // rebuild user list with new values
                var usersString = "";
                var i = 0;
                while (typeof userList[i] !== "undefined") {
                    for (var attr in userList[i]) {
                        usersString += userList[i][attr] + (attr !== "lifetimeValue" ? ',' : "");
                    }
                    usersString += "\n";
                    ++i;
                }
                // update CSV with new user data (order count & lifetime value) after conversion event
                await $.ajax({
                    type: "POST",
                    url: "./users.csv",
                    dataType: "text",
                    contentType: "text/plain",
                    data: usersString,
                    success: function () {
                        console.log("User data file successfully updated for user", userId);
                        _setActiveUser();
                    },
                    error: function (jqxhr, errStr, err) {
                        console.error("Failed to update user data file for user", userId, ":", errStr);
                    }
                });
            }

            // track purchase event
            await optimizelyClientInstance.track('item_purchase', userId, activeUser, itemAttributes);
            //window.location.href = '/purchase.html';
        }
        return window.userList;
    }


}



main();
