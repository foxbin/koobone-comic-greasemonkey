const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'koobone-comic.user.js'), 'utf8');

function createEnvironment({ editable = false, clickTarget = true } = {}) {
  let keydown;
  const clicks = [];
  const target = {
    closest: () => editable ? {} : null,
    dispatchEvent: (event) => {
      clicks.push(event);
      return true;
    },
  };

  class Element {}
  Object.setPrototypeOf(target, Element.prototype);

  const context = {
    Element,
    MouseEvent: class MouseEvent {
      constructor(type, options) { Object.assign(this, { type }, options); }
    },
    document: {
      activeElement: target,
      addEventListener: (type, listener) => { if (type === 'keydown') keydown = listener; },
      elementFromPoint: () => clickTarget ? target : null,
    },
    window: {
      innerWidth: 1200,
      innerHeight: 800,
      getComputedStyle: () => ({ display: 'block', visibility: 'visible' }),
    },
  };
  context.window.window = context.window;
  vm.runInNewContext(source, context);

  return {
    clicks,
    press(key, overrides = {}) {
      let prevented = false;
      keydown({
        key,
        target,
        defaultPrevented: false,
        repeat: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        preventDefault: () => { prevented = true; },
        ...overrides,
      });
      return prevented;
    },
  };
}

test('ArrowLeft clicks the left-middle area and prevents the default action', () => {
  const env = createEnvironment();
  assert.equal(env.press('ArrowLeft'), true);
  assert.equal(env.clicks.length, 1);
  assert.equal(env.clicks[0].clientX, 300);
  assert.equal(env.clicks[0].clientY, 400);
});

test('ArrowRight clicks the right-middle area', () => {
  const env = createEnvironment();
  assert.equal(env.press('ArrowRight'), true);
  assert.equal(env.clicks[0].clientX, 900);
});

test('does nothing while editing', () => {
  const editor = createEnvironment({ editable: true });
  assert.equal(editor.press('ArrowRight'), false);
  assert.equal(editor.clicks.length, 0);
});

test('metadata restricts execution to the confirmed reader iframe', () => {
  assert.match(source, /\/\/ @match\s+https:\/\/\/koobone\.com\/wpage\.htm\*/);
  assert.doesNotMatch(source, /bookof\.hk/);
});

test('ignores unrelated and modified shortcuts without blocking key repeat', () => {
  const env = createEnvironment();
  assert.equal(env.press('Enter'), false);
  assert.equal(env.press('ArrowLeft', { repeat: true }), true);
  assert.equal(env.press('ArrowRight', { ctrlKey: true }), false);
  assert.equal(env.clicks.length, 1);
});

test('does not prevent the default action when no click target exists', () => {
  const env = createEnvironment({ clickTarget: false });
  assert.equal(env.press('ArrowLeft'), false);
  assert.equal(env.clicks.length, 0);
});
