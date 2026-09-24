// ==UserScript==
// @name         KOOBONE 漫画键盘翻页
// @namespace    https://koobone.com/
// @version      1.0.1
// @description  在 KOOBONE 漫画阅读页面使用左右方向键翻页
// @match        https://koobone.com/wpage.htm*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  function isEditable(element) {
    if (!(element instanceof Element)) return false;
    return Boolean(element.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'));
  }

  function dispatchPageClick(direction) {
    const clientX = Math.round(window.innerWidth * (direction === 'left' ? 0.25 : 0.75));
    const clientY = Math.round(window.innerHeight * 0.5);
    const target = document.elementFromPoint(clientX, clientY);

    if (!target) return false;

    target.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX,
      clientY,
      button: 0,
    }));
    return true;
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (isEditable(event.target)) return;

    if (dispatchPageClick(event.key === 'ArrowLeft' ? 'left' : 'right')) {
      event.preventDefault();
    }
  });
})();
