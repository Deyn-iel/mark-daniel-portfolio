import test from 'node:test';
import assert from 'node:assert/strict';
import { quickReply } from './guide.js';

test('greetings work instantly without an AI download', () => {
  assert.equal(quickReply('Hi!').reply, 'Hello! How can I assist you today?');
  assert.equal(quickReply('hello').mode, 'guide');
});
test('matches each specific project and preserves the concept distinction', () => {
  for (const [question, topic] of [['Tell me about careers', 'careers'], ['poultry temperature', 'poultry'], ['smart trash can', 'trash'], ['STAPLE safety alert', 'staple'], ['AI chatbot concept', 'aisu'], ['attendance payroll', 'payroll'], ['franchise flow', 'franchise']]) {
    assert.equal(quickReply(question).topic, topic);
  }
  assert.match(quickReply('aisu').reply, /not a deployed AI system/);
  assert.match(quickReply('franchise flow').reply, /contributed/);
});
test('answers portfolio topics and contextual follow-ups', () => {
  assert.equal(quickReply('What skills does Mark have?').topic, 'skills');
  assert.equal(quickReply('Where did Mark study?').topic, 'education');
  assert.equal(quickReply('What is his education?').topic, 'education');
  assert.equal(quickReply('Show me his projects').href, '#works');
  assert.equal(quickReply('Tell me more about it', 'careers').topic, 'careers');
});
test('unknown questions do not invent qualifications or execute supplied markup', () => {
  assert.match(quickReply('What is the weather on Mars?').reply, /projects, skills, experience/);
  assert.match(quickReply('What is his salary?').reply, /contact him directly/);
  assert.ok(!quickReply('<script>alert(1)</script>').reply.includes('<script>'));
});
