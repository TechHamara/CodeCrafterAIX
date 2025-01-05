'use strict';

// Bloco para criar variável
Blockly.Blocks['create_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Create")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "IS_FINAL")
            .appendField("final")
            .appendField(new Blockly.FieldTextInput("variable", this.validateVariableName_), "VAR_NAME");
        this.appendDummyInput()
            .appendField("type")
            .appendField(new Blockly.FieldDropdown([
                ["byte", "byte"], ["short", "short"], ["int", "int"], ["long", "long"],
                ["float", "float"], ["double", "double"], ["char", "char"], ["boolean", "boolean"],
                ["Byte", "Byte"], ["Short", "Short"], ["Integer", "Integer"], ["Long", "Long"],
                ["Float", "Float"], ["Double", "Double"], ["Character", "Character"],
                ["Boolean", "Boolean"], ["String", "String"], ["ArrayList<String>", "ArrayList<String>"],
                ["HashSet<String>", "HashSet<String>"], ["TreeSet<String>", "TreeSet<String>"],
                ["HashMap<String,String>", "HashMap<String,String>"], ["String[]", "String[]"],
                ["YailList", "YailList"], ["Object", "Object"]
            ]), "VAR_TYPE");
        this.appendDummyInput()
            .appendField("initialize")
            .appendField(new Blockly.FieldCheckbox("FALSE", this.toggleInitialize_.bind(this)), "INITIALIZE");
        this.appendValueInput("INITIAL_VALUE")
            .setCheck(null)
            .appendField("value")
            .setVisible(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#546E7A");
        this.setTooltip("Creates a new variable.");
    },
    onchange: function(event) {
        if (!this.workspace) return;

        const varName = this.getFieldValue('VAR_NAME');
        const varType = this.getFieldValue('VAR_TYPE');

        if (event.type === Blockly.Events.BLOCK_CHANGE && event.blockId === this.id) {
            const oldName = event.oldValue;
            const newName = event.newValue;

            // Remove a variável antiga se o nome foi alterado
            if (oldName && oldName !== newName) {
                const oldVariable = this.workspace.getVariable(oldName, varType);
                if (oldVariable) {
                    this.workspace.deleteVariableById(oldVariable.getId());
                }
            }

            // Cria a nova variável, se não existir
            if (!this.workspace.getVariable(varName, varType)) {
                this.workspace.createVariable(varName, varType);
            }

            // Atualiza os dropdowns nos blocos get e set
            this.workspace.refreshVariableDropdowns();
        }
    },
    toggleInitialize_: function(newState) {
        const valueInput = this.getInput('INITIAL_VALUE');
        if (valueInput) {
            valueInput.setVisible(newState === 'TRUE');
        }
    },
    validateVariableName_: function(name) {
        const reservedNames = [
            "byte", "short", "int", "long", "float", "double", "char", "boolean",
            "Byte", "Short", "Integer", "Long", "Float", "Double", "Character",
            "Boolean", "String", "ArrayList<String>", "HashSet<String>", "TreeSet<String>",
            "HashMap<String,String>", "String[]", "YailList", "Object"
        ];

        const isValid = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
        return isValid && !reservedNames.includes(name) ? name : '';
    }
};

Blockly.Blocks['get_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Get")
            .appendField(new Blockly.FieldDropdown(this.updateDropdown_.bind(this)), "VAR_NAME");
        this.setOutput(true, null);
        this.setColour("#546E7A");
        this.setTooltip("Gets the value of a variable.");
    },
    updateDropdown_: function() {
        const variables = this.workspace?.getAllVariables() || [];
        return variables.length
            ? variables.map(variable => [variable.name, variable.name])
            : [["No variables", ""]];
    },
    updateVariableDropdown: function() {
        const dropdown = this.getField("VAR_NAME");
        if (dropdown) {
            const variables = this.workspace?.getAllVariables() || [];
            const options = variables.map(variable => [variable.name, variable.name]);
            const currentValue = dropdown.getValue();

            dropdown.menuGenerator_ = options;

            // Ajusta o valor selecionado se o atual não for mais válido
            if (!variables.some(variable => variable.name === currentValue)) {
                dropdown.setValue(variables.length > 0 ? variables[0].name : "No variables");
            }
        }
    }
};

Blockly.Blocks['set_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Set")
            .appendField(new Blockly.FieldDropdown(this.updateDropdown_.bind(this)), "VAR_NAME")
            .appendField("=");
        this.appendValueInput("VALUE").setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#546E7A");
        this.setTooltip("Sets a value to an existing variable.");
    },
    updateDropdown_: function() {
        const variables = this.workspace?.getAllVariables() || [];
        return variables.length
            ? variables.map(variable => [variable.name, variable.name])
            : [["No variables", ""]];
    },
    updateVariableDropdown: function() {
        const dropdown = this.getField("VAR_NAME");
        if (dropdown) {
            const variables = this.workspace?.getAllVariables() || [];
            const options = variables.map(variable => [variable.name, variable.name]);
            const currentValue = dropdown.getValue();

            dropdown.menuGenerator_ = options;

            // Ajusta o valor selecionado se o atual não for mais válido
            if (!variables.some(variable => variable.name === currentValue)) {
                dropdown.setValue(variables.length > 0 ? variables[0].name : "No variables");
            }
        }
    }
};




// Geradores de código
Blockly.JavaScript['create_variable'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    const varType = block.getFieldValue('VAR_TYPE');
    const isFinal = block.getFieldValue('IS_FINAL') === 'TRUE' ? 'final ' : '';
    const shouldInitialize = block.getFieldValue('INITIALIZE') === 'TRUE';
    let code = `${varType} ${varName}`;

    if (shouldInitialize) {
        const value = Blockly.JavaScript.valueToCode(block, 'INITIAL_VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT);
        code += ` = ${value || '0'}`;
    }
    return `${isFinal}${code};\n`;
};

Blockly.JavaScript['set_variable'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';
    return `${varName} = ${value};\n`;
};

Blockly.JavaScript['get_variable'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    return [varName, Blockly.JavaScript.ORDER_ATOMIC];
};
