$(() => {
  window.mapEntry = {};

  const createMapEntry = function(maps) {
    console.log("making map entry", maps);
    return `
    <article class="mapEntry m-auto">
      <section class ="container-fluid">
      <div class="card my-3">
        <div class="card-body">
          <a class="card-link" href="/api/maps/?=">
            <h5 class="card-title">${maps.title}</h5>
          </a>
          <p>${maps.description}</p>
        </div>
      </div>
    </section>
    </article>
    `;
  };

  window.mapEntry.createMapEntry = createMapEntry;
});
