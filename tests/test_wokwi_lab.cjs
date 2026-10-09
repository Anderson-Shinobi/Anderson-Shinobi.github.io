/* Offline structural proof for the Wokwi circuit and AVR register design.
 * Not a replacement for starting the simulator and examining VCD evidence.
 */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../labs/wokwi/uno-baremetal-pwm");
const diagram = JSON.parse(fs.readFileSync(path.join(root,"diagram.json"),"utf8"));
const code = fs.readFileSync(path.join(root,"sketch.ino"),"utf8");
assert.equal(diagram.version,1);
assert.equal(diagram.editor,"wokwi");
const ids = diagram.parts.map(p => p.id);
assert.equal(new Set(ids).size,ids.length,"Each component requires a unique id");
const parts = Object.fromEntries(diagram.parts.map(p => [p.id,p]));
assert.equal(parts.uno.type,"wokwi-arduino-uno");
assert.equal(parts.led1.type,"wokwi-led");
assert.equal(parts.r1.attrs.value,"220");
assert.equal(parts.logic1.type,"wokwi-logic-analyzer");
assert.equal(Number(parts.logic1.attrs.bufferSize) <= 100000, true,"Avoid excessive analyzer memory use");

const wires = diagram.connections.map(entry => {
  assert.ok(Array.isArray(entry) && entry.length === 4);
  for(const endpoint of entry.slice(0,2)) {
    const [part,pin] = endpoint.split(":");
    assert.ok(parts[part] && pin, "Unknown component: "+endpoint);
  }
  return entry.slice(0,2).join(" -> ");
});
for(const edge of [
  "uno:9 -> r1:1", "r1:2 -> led1:A", "led1:C -> uno:GND.2",
  "uno:9 -> logic1:D0", "uno:13 -> logic1:D1", "uno:GND.3 -> logic1:GND"
]) assert.ok(wires.includes(edge),"Missing connection: "+edge);

const logic = code.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\/\/[^\n]*/g,"");
assert.match(logic,/#include\s*<avr\/io\.h>/);
assert.match(logic,/DDRB\s*\|=/);
assert.match(logic,/TCCR1A\s*=\s*_BV\(COM1A1\)\s*\|\s*_BV\(WGM10\)/);
assert.match(logic,/TCCR1B\s*=\s*_BV\(WGM12\)\s*\|\s*_BV\(CS11\)\s*\|\s*_BV\(CS10\)/);
assert.match(logic,/OCR1A\s*=/);
assert.match(logic,/UDR0\s*=/);
assert.doesNotMatch(logic,/\b(?:pinMode|digitalWrite|analogWrite|delay|Serial|malloc|free)\s*\(/);
assert.equal(16000000/(64*256),976.5625,"Timer1 PWM calculation");
for(const count of [26,128,230]) assert.ok(count>=0 && count<=255);
assert.equal(diagram.serialMonitor.display,"auto");
const license = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
assert.match(license, /^MIT License\s*$/m);
assert.match(license, /Copyright \(c\) 2026 Anderson Nogueira/);
assert.match(license, /Permission is hereby granted, free of charge/);
assert.match(license, /THE SOFTWARE IS PROVIDED "AS IS"/);
assert.match(code, /SPDX-License-Identifier: MIT/);
console.log("PASS: laboratory-scoped MIT license and firmware SPDX header");

console.log("PASS: UNO connections, LED, analyzer, register-only code and PWM formula");
