$(() => {
  const createPinList = function(pins) {
    return ``;
  }

  window.pinList.createPinList = createPinList;
});



const createPinList = function (items, itemType) {
  $mapContentBody.append(`<div>All ${itemTyps}s</div>`);
  const $ListContainer = $(`<div class="container row" id="list-container"></div>`);
  for (const item of items) {
    if (itemType === 'pin') {
      $ListContainer.append(createPinListItem(item));
    } else {
      $ListContainer.append(createCollabListItem(item));
    }
  }
  $mapContentBody.append($pinListContainer);
};
