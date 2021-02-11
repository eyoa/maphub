$(() => {
  window.mapEntry = {};

  const createMapEntry = function(maps, favList) {
    let favToggle = ``;
    if (favList) {
      if (favList.includes(maps.id)) {
        favToggle = `<img class="fav-Toggle" id="fav" src="./../../images/fav-sel.png" style="height:20px;">`
      } else {
        favToggle = `<img class="fav-Toggle" id="not-fav" src="./../../images/fav-unsel.png" style="height:20px;">`
      }
    }



    return `
    <article class="mapEntry m-auto" id="${maps.id}">
      <section class ="container-fluid">
      <div class="card my-3">
        <div class="card-body">
          <div class="row mx-2 my-2">
            <h5 class="card-title">${maps.title}</h5>
            <div class="col">${favToggle}</div>
          </div>
          </a>
          <div class="row">
            <div class ="col mx-2">
              <p>${maps.description}</p>
            </div>
            <div class ="col">
              <button class="btn btn-primary" id="view-map">view map</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </article>
    `;
  };

  window.mapEntry.createMapEntry = createMapEntry;
});
