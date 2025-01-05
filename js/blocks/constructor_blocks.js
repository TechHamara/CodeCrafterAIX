//blocks/constructor_blocks.js

//Blocks
Blockly.Blocks['extension_class'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Create Extension"), "className")
        .appendField(new Blockly.FieldTextInput("MyExtension"), "classNameEdit");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Version"), "versionLabel")
        .appendField(new Blockly.FieldNumber(1, 1), "versionEdit");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Version Name"), "versionName")
        .appendField(new Blockly.FieldTextInput("1.0"), "versionNameEdit");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Description"), "descriptionName")
        .appendField(new Blockly.FieldTextInput("Developed by You Name Here using Fast."), "descriptionNameEdit");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Icon Name"), "NAME")
        .appendField(new Blockly.FieldTextInput("icon.png"), "imageURL");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Class Type:"), "inheritanceLabel");
    this.appendDummyInput()
        .appendField("extends")
        .appendField(new Blockly.FieldTextInput("AndroidNonvisibleComponent"), "extendsClass");
    this.appendDummyInput()
        .appendField("implements")
        .appendField(new Blockly.FieldTextInput(""), "implementsInterfaces");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("ANNOTATIONS"), "annotationsText");
    this.appendStatementInput("annotationBlocks")
        .setCheck(null);
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("BLOCKS"), "blocksExtensions");
    this.appendStatementInput("statementBlocks")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setColour("#5C6BC0");
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['package_declaration'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Package")
            .appendField(new Blockly.FieldTextInput("com.example.extension"), "PACKAGE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#5C6BC0");
        this.setTooltip("Declares the extension package");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['custom_annotation'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Custom Annotation")
            .appendField(new Blockly.FieldTextInput("@MyAnnotation"), "ANNOTATION");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#5C6BC0");
        this.setTooltip("Adds a custom annotation above @SimpleObject");
        this.setHelpUrl("");
    }
};

// Bloco do construtor
Blockly.Blocks['constructor_declaration'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput('Constructor'), 'CONSTRUCTOR_NAME')
            .appendField(new Blockly.FieldCheckbox("TRUE"), "IS_DEFAULT")
            .appendField("default");
        this.appendStatementInput('PARAMETERS')
            .setCheck('constructor_parameter')
            .appendField('parameters');
        this.appendStatementInput('SUPER_CALL')
            .setCheck('constructor_super_call')
            .appendField('super call');
        this.appendStatementInput('CONSTRUCTOR_CONTENT')
            .setCheck(null)
            .appendField('implementation');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#5C6BC0");
        this.setTooltip('Define o construtor da extensão');
        
        this.updateShape_();
    },
    
    mutationToDom: function() {
        var container = document.createElement('mutation');
        var isDefault = (this.getFieldValue('IS_DEFAULT') == 'TRUE');
        container.setAttribute('is_default', isDefault);
        return container;
    },
    
    domToMutation: function(xmlElement) {
        var isDefault = (xmlElement.getAttribute('is_default') == 'true');
        this.getField('IS_DEFAULT').setValue(isDefault ? 'TRUE' : 'FALSE');
        this.updateShape_();
    },
    
    updateShape_: function() {
        var isDefault = (this.getFieldValue('IS_DEFAULT') == 'TRUE');
        if (isDefault) {
            if (this.getInput('PARAMETERS')) this.removeInput('PARAMETERS');
            if (this.getInput('SUPER_CALL')) this.removeInput('SUPER_CALL');
        } else {
            if (!this.getInput('PARAMETERS')) {
                this.appendStatementInput('PARAMETERS')
                    .setCheck('constructor_parameter')
                    .appendField('parameters');
            }
            if (!this.getInput('SUPER_CALL')) {
                this.appendStatementInput('SUPER_CALL')
                    .setCheck('constructor_super_call')
                    .appendField('super call');
            }
        }
    }
};

// Bloco de parâmetro do construtor
Blockly.Blocks['constructor_parameter'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('parameter')
            .appendField(new Blockly.FieldTextInput('paramName'), 'PARAM_NAME')
            .appendField('type')
            .appendField(new Blockly.FieldDropdown([
                ['ComponentContainer', 'ComponentContainer'],
                ['Context', 'Context'],
                ['String', 'String'],
                ['int', 'int'],
                ['boolean', 'boolean']
            ]), 'PARAM_TYPE');
        this.setPreviousStatement(true, 'constructor_parameter');
        this.setNextStatement(true, 'constructor_parameter');
        this.setColour("#5C6BC0");
        this.setTooltip('Adiciona um parâmetro ao construtor');
    }
};

// Bloco para chamada super
Blockly.Blocks['constructor_super_call'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("super(container.$context())"), "SUPER_PARAMS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

// Geradores de código
Blockly.JavaScript['constructor_declaration'] = function(block) {
    var constructorName = block.getFieldValue('CONSTRUCTOR_NAME');
    var isDefault = block.getFieldValue('IS_DEFAULT') == 'TRUE';
    var content = Blockly.JavaScript.statementToCode(block, 'CONSTRUCTOR_CONTENT') || '';
    
    if (isDefault) {
        return `    public ${constructorName}(ComponentContainer container) {
${content}    }\n`;
    } else {
        var parameters = Blockly.JavaScript.statementToCode(block, 'PARAMETERS') || '';
        var superCall = Blockly.JavaScript.statementToCode(block, 'SUPER_CALL') || '';
        
        parameters = parameters.trim().replace(/,\s*$/, '');
        
        return `    public ${constructorName}(${parameters}) {
${superCall}${content}    }\n`;
    }
};

Blockly.JavaScript['constructor_parameter'] = function(block) {
    var paramName = block.getFieldValue('PARAM_NAME');
    var paramType = block.getFieldValue('PARAM_TYPE');
    
    return paramType + ' ' + paramName + ', ';
};

Blockly.JavaScript['constructor_super_call'] = function(block) {
    var params = block.getFieldValue('SUPER_PARAMS');
    var afterSuper = Blockly.JavaScript.statementToCode(block, 'AFTER_SUPER') || '';
    
    return `        ${params};
${afterSuper}`;
};

//Generators
Blockly.JavaScript['extension_class'] = function(block) {
  let className = block.getFieldValue('classNameEdit');
  let version = block.getFieldValue('versionEdit');
  let versionName = block.getFieldValue('versionNameEdit');
  let description = block.getFieldValue('descriptionNameEdit');
  let iconName = block.getFieldValue('imageURL');
  let extendsClass = block.getFieldValue('extendsClass').trim();
  let implementsInterfaces = block.getFieldValue('implementsInterfaces').trim();
  let annotations = Blockly.JavaScript.statementToCode(block, 'annotationBlocks');
  let members = Blockly.JavaScript.statementToCode(block, 'statementBlocks');
  
  // Construindo a herança da classe
  let inheritance = '';
  if (extendsClass) {
    inheritance += `extends ${extendsClass}`;
  }
  if (implementsInterfaces) {
    inheritance += inheritance ? ` implements ${implementsInterfaces}` : `implements ${implementsInterfaces}`;
  }
  
  let code = `@DesignerComponent(
    version = ${version},
    versionName = "${versionName}",
    description = "${description}",
    iconName = "${iconName}"
)
${annotations}public class ${className} ${inheritance} {
${members}}`;
  return code;
};

Blockly.JavaScript['custom_annotation'] = function(block) {
    let annotation = block.getFieldValue('ANNOTATION');
    return `${annotation}\n`;
};


Blockly.JavaScript['package_declaration'] = function(block) {
    let package = block.getFieldValue('PACKAGE');
    return `package ${package};\n\n`;
};
