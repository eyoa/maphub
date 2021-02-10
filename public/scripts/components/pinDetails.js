$(() => {
  window.pinDetail = {};

  const createPinDetail = function(pin) {
    return `
    <article class="pinDetail m-auto">
      <section class ="d-flex flex-row">
        <div class="card mx-5 my-3">
          <div class="card-body d-flex">
            <div class = "w-50">
              <img class="card-img-top" src="${pin.img_url}" alt="${pin.title}">
            </div>
            <div class = " my-2 ml-3">
              <h5 class="card-title">${pin.title}</h5>
              <p>${pin.description}</p>
            </div>
          </div>
          <button class="btn btn-primary" id="close-pin-detail">close</button>
        </div>
      </section>
    </article>
    `;
  };

  window.pinDetail.createPinDetail = createPinDetail;
});

// function for pin details - there should only be one entry returned by pin id.
  // receives it as [{pin details}]
  // const pinDetails = function(data) {
  //   clearList();
  //   const entry = window.pinDetail.createPinDetail(data[0]);
  //   $mapList.append(entry);

  // };

  //TEST DATA
  // const data = [{title: "ROM", description : "museum", img_url: "https://lh3.googleusercontent.com/proxy/9GtkRGZOr2JCwRWSdFUpbSeQI3tGqW4RAbS7mWytNEmHTKDGmTbzlVkGzMsxBPZuzIGrjGWTWqXDtQzRwZubeQ-RfFa6PEJTHGHDl8wvEs-bBFjoYKgm7xJs_fLJ59ZIdZgjYUEhTSk2R38YuWnViqP2U4wP8iY=w408-h272-k-no"}];
  // pinDetails(data);
