//test ajax routes
function testQueries() {
  console.log('testing ... ');
  return $.ajax({
    method: "GET",
    url: "/test"
  });
};
