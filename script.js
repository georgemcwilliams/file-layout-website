function addRule() {
    const ruleContainer = document.getElementById("rules-container");

    // Create a new rule div
    const ruleDiv = document.createElement("div");
    ruleDiv.className = "rule";

    // Create text boxes for start characters, field begin, and field length
    const startCharsInput = document.createElement("input");
    startCharsInput.placeholder = "Start Characters";

    const fieldBeginInput = document.createElement("input");
    fieldBeginInput.type = "number";
    fieldBeginInput.placeholder = "Field Begin";

    const fieldLengthInput = document.createElement("input");
    fieldLengthInput.type = "number";
    fieldLengthInput.placeholder = "Field Length";

    // Create dropdown for identifiers
    const identifierSelect = document.createElement("select");

    const infoOption = new Option("--- Select Identifier ---", "");
    infoOption.disabled = true;
    identifierSelect.options.add(infoOption);

    identifierSelect.options.add(new Option("Option 1", "1"));
    identifierSelect.options.add(new Option("Option 2", "2"));

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "X";
    deleteButton.className = "delete-button";
    deleteButton.onclick = function () {
        ruleContainer.removeChild(ruleDiv);
    };


    // Append elements to rule div
    ruleDiv.appendChild(startCharsInput);
    ruleDiv.appendChild(fieldBeginInput);
    ruleDiv.appendChild(fieldLengthInput);
    ruleDiv.appendChild(identifierSelect);
    ruleDiv.appendChild(deleteButton);

    // Append rule div to rule container
    ruleContainer.appendChild(ruleDiv);
}


// add the first rule
addRule();

function enforceNumeric(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

function deleteRule(ruleDiv) {
    ruleDiv.remove();
}

function exportRules() {
    const rules = [];
    const ruleDivs = document.querySelectorAll(".rule");

    for (const ruleDiv of ruleDivs) {
        const inputs = ruleDiv.querySelectorAll("input");
        const select = ruleDiv.querySelector("select");

        rules.push({
            startChar: inputs[0].value,
            fieldBegin: inputs[1].value,
            fieldLength: inputs[2].value,
            identifier: select.value,
        });
    }

    const date = new Date();
    const dateTimeString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

    const fileName = `Exported_Rules_${dateTimeString}.json`;

    const blob = new Blob([JSON.stringify(rules)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function triggerFileInput() {
    const fileInput = document.getElementById('importFile');
    fileInput.click();

    fileInput.onchange = function () {
        if (fileInput.files[0]) {
            importRules();
        }
    };
}

function importRules() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function (event) {
        const jsonData = JSON.parse(event.target.result);

        // Remove existing rules only if new rules are successfully loaded
        const existingRules = document.querySelectorAll(".rule");
        existingRules.forEach(rule => rule.remove());

        // Add imported rules
        jsonData.forEach(importedRule => {
            addImportedRule(importedRule);
        });
    };
}

function addImportedRule(importedRule) {
    addRule(); // This adds a new rule div
    const ruleDivs = document.querySelectorAll(".rule");
    const lastRuleDiv = ruleDivs[ruleDivs.length - 1];

    const inputs = lastRuleDiv.querySelectorAll("input");
    const select = lastRuleDiv.querySelector("select");

    inputs[0].value = importedRule.startChar;
    inputs[1].value = importedRule.fieldBegin;
    inputs[2].value = importedRule.fieldLength;
    select.value = importedRule.identifier;
}

