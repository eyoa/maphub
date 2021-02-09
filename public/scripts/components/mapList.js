$(() => {
  window.mapList = {};

  const $mapList = $(`
  <section class="map-list" id="map-list">
    <p>Loading...</p>
  </section>
  `);

  window.$mapList = $mapList;

  function clearList() {
    $mapList.empty();
  }

  const addMapEntries = function(data) {
    clearList();
    for (const mapRow of data) {
      const entry = window.mapEntry.createMapEntry(mapRow);
      $mapList.append(entry);
    }
  };
  window.mapList.addMapEntries = addMapEntries;

});
