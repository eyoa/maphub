$(() => {
  window.collaboratorList = {};

  const createCollabList = function(currentUser, collaborators, state) {
    let deleteBtn = '';
    let addBtn = '';

    if (state === 'editDetail') {
      deleteBtn = `
        <button class="btn btn-default delete-collab-btn">
            <i class="far fa-trash-alt"></i>
        </button>
      `;
      addBtn = `
          <li class ="list-group-item d-flex flex-row">
            <div class="list-group-item-action ml-auto new-collab-container" data-toggle="collapse" data-target="#addCollabForm">
                  <input name="username" type="text" placeholder="Enter collaborator name" id="new-collab-username">
                  <button class="btn btn-primary ml-auto" id="addCollabBtn">
                    Add!
                  </button>
            </div>
          </li>
      `;
    }

    let coList = `
    <article class="pinDetail my-3">
      <section class="w-50 m-auto">
        <label class="mx-3">Collaborators</label>
        <ul class ="list-group list-group-flush d-flex flex-col">
    `;

    if (collaborators.length !== 0){
      let count = 0;
      for (const entry of collaborators){
        count += 1;
        coList +=`
        <li class = "list-group-item d-flex flex-row collab-item-container" id="${entry.id}">
          <div class="list-group-item-action mr-auto" data-toggle="collapse" data-target="#deleteBtn${count}">
            <a class="list-group-item-action" href="/users/?id=${entry.id}">
              ${entry.id === currentUser ? `${entry.username} (owner)`: entry.username}
            </a>
          </div>
          <div class="collapse ml-auto my-auto" id="deleteBtn${count}">
            <form action="/api/collaborators/" method"delete">
              <input type="hidden" class="hidden" name="user_id" value="${entry.id}">
              ${entry.id === currentUser ? '' : deleteBtn}
            </form>
          </div>
        </li>
        `;
      }
    }

    coList+=addBtn;

    coList += `
          </ul>
        </section>
      </article>
    `;
    return coList;
  };

  window.collaboratorList.createCollabList = createCollabList;
});

  // function for collabList
  // const collabList = function(data) {
  //   clearList();
  //   console.log(window.collaboratorList);
  //   const entry = window.collaboratorList.createCollabList(data);
  //   $mapList.append(entry);
  // };

  // // TEST DATA
  // const data = [{id: 1, username: "username1"}, {id: 2, username: "username2"}];
  // collabList(data);
