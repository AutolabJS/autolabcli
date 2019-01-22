class PromptGenerator {
  constructor() {
    this.prompt = {};
  }

  addProperty(property, value) {
    this.prompt[property] = value;
  }

  getPrompt() {
    return this.prompt;
  }
}

module.exports = PromptGenerator;
