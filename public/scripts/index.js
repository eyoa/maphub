$(() =>{
  getMapList()
  .then((data) =>{
    mapList.addMapEntries(data);
    views_manager.show('mapList');
  })
  .catch(error => console.error(error));
})
