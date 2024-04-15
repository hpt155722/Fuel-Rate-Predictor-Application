const $ = require('jquery');
global.$ = $;
global.jQuery = $;

const { JSDOM } = require('jsdom');
// create a simulated DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
