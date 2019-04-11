// JavaScript SDK Demo App
// Copyright 2018 Optimizely. Licensed under the Apache License
import OptimizelyManager from './optimizely_manager';
const _ = require('underscore');
window.userAttributes = {},
    window.items = [];
window.userList = [];
let optimizelyClientInstance = {};
async function main() {
    optimizelyClientInstance = await OptimizelyManager.createInstance();

    async function _logPurchase(user, item) {
        console.log("Logging purchase for UserID:", user, "& Item:", item);
        var itemAttributes = {
            category: items[item].category,
            price: items[item].price,
            revenue: items[item].price * 100,
        };
        var userId = "" + parseInt(user);
        var price = itemAttributes.price;
        if (!!userId && !!price && price > 0) {
            if (userId > -1) {
                ++userList[userId].orderCount;
                userList[userId].lifetimeValue += price;
                _updateUserDetails();
                var usersString = "";
                var i = 0;
                while (typeof userList[i] !== "undefined") {
                    for (var attr in userList[i]) {
                        usersString += userList[i][attr] + (attr !== "lifetimeValue" ? ',' : "");
                    }
                    usersString += "\n";
                    ++i;
                }
                await $.ajax({
                    type: "POST",
                    url: "./users.csv",
                    dataType: "text",
                    contentType: "text/plain",
                    data: usersString,
                    success: function () {
                        console.log("User data file successfully updated for user", userId);
                        _getUserAttributes();
                    },
                    error: function (jqxhr, errStr, err) {
                        console.error("Failed to update user data file for user", userId, ":", errStr);
                    }
                });
            }
            console.dir(userAttributes);
            console.dir(itemAttributes);
            await optimizelyClientInstance.track('item_purchase', userId, userAttributes, itemAttributes);
            //window.location.href = '/purchase.html';
        }
        return window.userList;
    }


    $(document).ready(function () {
        _buildUsers().then(_renderUserList);
        _buildItems().then(_renderItemsTable).then(function (tableHTML) {
            $('#items-table').html(tableHTML);

            $(".buy-button").on("click", function () {
                let userID = $('#users-list').val() || -1;
                let itemID = $(this).data("itemid");
                _logPurchase(userID, itemID);
            });
        });
        $('#input-name-button').on('click', function () {
            _getUserAttributes();
            let userID = $('#users-list').val() || -1;
            shop(userID);
        });
    });

    function shop(userID) {
        // retrieve Feature Flag
        localStorage.setItem("opzDemoUser", userID);
        const isSortingEnabled = optimizelyClientInstance.isFeatureEnabled('sorting_enabled', userID, userAttributes);
        console.log("Sorting enabled?", isSortingEnabled);
        // display feature if enabled
        if (isSortingEnabled) {
            _renderSortingDropdown();
            //$('#sorting').change();
        } else {
            // ensure feature is disabled
            $('#sorting').remove();
        }
        // update UI to display if Feature Flag is enabled
        const indicatorBool = (isSortingEnabled) ? 'ON' : 'OFF';
        const indicatorMessage = `[Feature ${indicatorBool}] The feature "sorting_enabled" is ${indicatorBool} for user ${userID}`;
        $('#feature-indicator').html(indicatorMessage);
        // retrieve welcome message stored as a feature variable
        const welcomeMessage = optimizelyClientInstance.getFeatureVariableString('sorting_enabled', 'welcome_message', userID, userAttributes);
        if (welcomeMessage) {
            $('#welcome').html(welcomeMessage);
        } else {
            // Set a default message
            $('#welcome').html('Welcome to Attic & Button');
        }
    }



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

    function _renderItemsTable(items) {
        let table = document.createElement('table');
        let i = 0;
        while (typeof items[i] !== 'undefined') {
            let row = table.insertRow(-1);
            for (var c = 0; c < 3; c++) {
                let cell = row.insertCell(-1);
                let cellContent = document.createElement('div');
                cellContent.innerHTML = items[i].name;
                cellContent.innerHTML += ' in ' + items[i].color + '<br>';
                cellContent.innerHTML += '<b>' + items[i].category + ', $' + items[i].price + '</b>';
                cellContent.innerHTML += '<img src="./images/' + items[i].imageUrl + '" >';
                cellContent.innerHTML += '<button data-itemid="' + i + '"' + 'class="red-button buy-button">Buy Now</button>';
                cell.appendChild(cellContent);
                i += 1;
            }
        }
        return table;
    }

    function _renderSortingDropdown() {
        const selectTitle = document.createElement('span');
        selectTitle.innerHTML += 'Sort Items By: ';
        const selectTypes = document.createElement('select');
        selectTypes.setAttribute('id', 'sorting_type');
        selectTypes.innerHTML += '<option disabled selected value></option>';
        selectTypes.innerHTML += '<option value="price">Price</option>';
        selectTypes.innerHTML += '<option value="category">Category</option>';
        selectTitle.appendChild(selectTypes)
        $('#sorting').html(selectTitle);
        $('#sorting').on('change', function () {
            var sortType = $('#sorting_type option:selected').val();
            var userId = $('#users-list').val() || -1;
            optimizelyClientInstance.track('sorting_change', userId, userAttributes);
            _buildItems().then(function (items) {
                items = _.sortBy(items, sortType);
                return _renderItemsTable(items);
            }).then(function (tableHTML) {
                $('#items-table').html(tableHTML);

                $(".buy-button").on("click", function () {
                    let userID = $('#users-list').val() || -1;
                    let itemID = $(this).data("itemid");
                    _logPurchase(userID, itemID);
                });

            });
        });
    }

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
    list.addEventListener("change", _updateUserDetails);
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
        _updateUserDetails();
        $("#input-name-button").click();
    }

    return list;
}

async function _updateUserDetails() {
    let container = document.getElementById("user-details");
    container.innerHTML = "";
    let userid = document.getElementById("users-list").value;
    if (userid !== "") {
        let user = window.userList[parseInt(userid)];
        let table = document.createElement('table');
        for (var prop in user) {
            let row = table.insertRow(-1);
            let cell1 = row.insertCell(-1);
            cell1.innerHTML = "<b>" + prop + "</b>";
            let cell2 = row.insertCell(-1);
            cell2.innerHTML = (prop === "lifetimeValue" ? "$" : "") + user[prop];
        }
        container.appendChild(table);
    }
}

function _getUserAttributes() {
    const userID = $('#users-list').val();
    if (!userID) {
        return;
    }
    if (userList && userList.length > 0) {
        var user = userList[parseInt(userID)];
        for (var prop in user) {
            userAttributes[prop] = user[prop];
        }
    }
}


main();
