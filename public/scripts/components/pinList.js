$(() => {
  window.pinList = {};
  const createPinItem = function (pin, state) {
    let editRemoveBtn = ``;
    if (state === 'editDetail') {
      editRemoveBtn = `
      <div class="col">
        <button class="btn btn-secondary mx-auto" id="pin-edit-prompt">edit</button>
        <button class="btn btn-secondary mx-auto" id="pin-remove">remove</button>
      </div>
      `;
    }

    return `
      <div class="container my-1 row pin-item" id="${pin.id}">
        <div class="col pin-title">${pin.title}</div>
        ${editRemoveBtn}
      </div>
    `;
  };

  const createPinList = function(pins, state) {
    let pinList = '';
    for (const pin of pins) {
      pinList += `
        ${createPinItem(pin, state)}
      `;
    }

    let addPrompt = '';
    if (state === 'editDetail') {
      addPrompt = `<p>Click and hold on the map to add a pin!</p>`;
    }

    let pinContainer = `
    ${addPrompt}
    <div class="container my-2 " id="pin-list">
        <div>All pins</div>
        ${pinList}
      </div>
    `;
    return pinContainer;
  }

  window.pinList.createPinList = createPinList;
});
