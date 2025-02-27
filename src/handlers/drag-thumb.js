import * as CSS from '../lib/css';
import * as DOM from '../lib/dom';
import cls, {
  addScrollingClass,
  removeScrollingClass,
} from '../lib/class-names';
import updateGeometry from '../update-geometry';
import { toInt } from '../lib/util';

export default function (i) {
  bindMouseScrollHandler(i, [
    'containerWidth',
    'contentWidth',
    'pageX',
    'railXWidth',
    'scrollbarX',
    'scrollbarXWidth',
    'scrollLeft',
    'x',
    'scrollbarXRail',
  ]);
  bindMouseScrollHandler(i, [
    'containerHeight',
    'contentHeight',
    'pageY',
    'railYHeight',
    'scrollbarY',
    'scrollbarYHeight',
    'scrollTop',
    'y',
    'scrollbarYRail',
  ]);
}

function bindMouseScrollHandler(
  i,
  [
    containerHeight,
    contentHeight,
    pageY,
    railYHeight,
    scrollbarY,
    scrollbarYHeight,
    scrollTop,
    y,
    scrollbarYRail,
  ]
) {
  const element = i.element;

  let startingScrollTop = null;
  let startingMousePageY = null;
  let scrollBy = null;

  function mouseMoveHandler(e) {
    const py = e.touches && e.touches[0] ? e.touches[0].pageY : e[pageY];

    element[scrollTop] =
      startingScrollTop + scrollBy * (py - startingMousePageY);
    addScrollingClass(i, y);
    updateGeometry(i);

    e.stopPropagation();
    if (e.type.startsWith('touch') && e.changedTouches.length > 1) {
      i.event.preventDefault(e, false);
    }
  }

  function mouseUpHandler() {
    removeScrollingClass(i, y);
    i[scrollbarYRail].classList.remove(cls.state.clicking);
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  function bindMoves(e, touchMode) {
    if (element.classList.contains('ps-disabled')) {
      return;
    }
    startingScrollTop = element[scrollTop];
    startingMousePageY =
      touchMode && e.touches && e.touches[0] ? e.touches[0].pageY : e[pageY];

    scrollBy =
      (i[contentHeight] - i[containerHeight]) /
      (i[railYHeight] - i[scrollbarYHeight]);
    if (!touchMode) {
      i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
      i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);
      i.event.preventDefault(e, false);
    } else {
      i.event.bind(i.ownerDocument, 'touchmove', mouseMoveHandler);
    }

    i[scrollbarYRail].classList.add(cls.state.clicking);

    e.stopPropagation();
  }

  i.event.bind(i[scrollbarY], 'mousedown', (e) => {
    bindMoves(e);
  });
  i.event.bind(i[scrollbarY], 'touchstart', (e) => {
    bindMoves(e, true);
  });
}
