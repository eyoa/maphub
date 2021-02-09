$(() => {
  // For use with views manager later?
  const $main = $("#main-content");
  // getMapList()
  // .then()

  // first html build version will always append if active in html
  // hook up ajax next step

  //TEST CODE
  // fake JSON data
  const data = [{"title":"Toronto","description":"this is Toronto"},{"title":"New York","description":"this is New York"},{"title":"Seoul","description":"this is Seoul"}];

  const $mapList = $(`
  <section class="map-list" id="map-list">
    <p>Loading...</p>
  </section>
  `);

  window.mapList = $mapList;

  function clearList() {
    $mapList.empty();
  }

  // console.log("Map entry", window.mapEntry);
  const addMapEntries = function(data) {
    clearList();
    for (const mapRow of data) {
      const entry = window.mapEntry.createMapEntry(mapRow);
      $mapList.append(entry);
      // console.log("mapEntry is ", mapRow);
      // console.log(entry);
    }

  };

  // currently will append as long as script is in index.html
  // $main.append($mapList);
  addMapEntries(data);


});
